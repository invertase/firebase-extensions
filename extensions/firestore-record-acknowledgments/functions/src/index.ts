import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as logs from './logs';
import config from './config';
import { noticeConverter, acknowledgmentConverter } from './converter';

import { getEventarc } from 'firebase-admin/eventarc';
import { Acknowledgment, Notice } from './interface';
import { firestore } from 'firebase-admin';
import { createIndexUrlOnRequestHandler } from './indexer';

admin.initializeApp();
const db = admin.firestore();

/** Setup EventArc Channels */
const eventChannel =
  process.env.EVENTARC_CHANNEL &&
  getEventarc().channel(process.env.EVENTARC_CHANNEL, {
    allowedEventTypes: process.env.EXT_SELECTED_EVENTS,
  });

logs.init();

// Throws an error if the user is not authenticated.
function assertAuthenticated(context: functions.https.CallableContext) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated.',
    );
  }
}

// Throws an error if the user is not allowed to see the notice.
function assertAllowed(
  context: functions.https.CallableContext,
  notice: Notice,
  error: string,
) {
  if (
    notice.allowList.length > 0 &&
    !notice.allowList.includes(context.auth!.uid)
  ) {
    throw new functions.https.HttpsError('not-found', error);
  }
}

type GetNoticeResponse = Omit<Notice, 'allowList'> & {
  unacknowledgedAt?: firestore.Timestamp;
  acknowledgments: Acknowledgment[];
};

export const getNotice = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);

  if (!data.type) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'No notice `type` has been provided.',
    );
  }

  let query = db
    .collection(config.noticesCollection)
    .where('type', '==', data.type);

  if (data.version) {
    query = query.where('version', '==', data.version);
  }

  const snapshot = await query
    .orderBy('createdAt', 'desc')
    .limit(1)
    .withConverter(noticeConverter)
    .get();

  if (snapshot.empty) {
    throw new functions.https.HttpsError(
      'not-found',
      `No notices with the type ${data.type} could be found.`,
    );
  }

  const noticeData = snapshot.docs[0].data();
  const { allowList, ...notice } = noticeData;

  assertAllowed(
    context,
    noticeData,
    `No notices with the type ${data.type} could be found.`,
  );

  const acknowledgmentsSnapshot = await db
    .collection(config.noticesCollection)
    .doc(notice.id)
    .collection(config.acknowledgmentsCollection)
    .where('userId', '==', context.auth!.uid)
    .orderBy('createdAt', 'desc')
    .withConverter(acknowledgmentConverter)
    .get();

  // Get an array of plain acknowledgment objects.
  const acknowledgments = acknowledgmentsSnapshot.docs.map(doc => doc.data());

  // Check if the user has acknowledged the notice.
  const unacknowledgedAt =
    acknowledgments.length === 0
      ? undefined
      : acknowledgments[0].ackEvent === 'unacknowledged'
      ? acknowledgments[0].createdAt
      : undefined;

  // Create a variable to assert a typed response
  const response: GetNoticeResponse = {
    ...notice,
    unacknowledgedAt,
    acknowledgments,
  };

  return response;
});

async function handleAcknowledgment(
  data: any,
  context: functions.https.CallableContext,
): Promise<firestore.DocumentSnapshot<Notice>> {
  assertAuthenticated(context);

  if (!data.noticeId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'No `noticeId` has been provided.',
    );
  }

  const noticeSnapshot = await db
    .collection(config.noticesCollection)
    .doc(data.noticeId)
    .withConverter(noticeConverter)
    .get();

  if (!noticeSnapshot.exists) {
    throw new functions.https.HttpsError(
      'not-found',
      `No notice with the id ${data.noticeId} could be found.`,
    );
  }

  assertAllowed(
    context,
    noticeSnapshot.data(),
    `No notice with the id ${data.noticeId} could be found.`,
  );

  return noticeSnapshot;
}

export const acknowledgeNotice = functions.https.onCall(
  async (data, context) => {
    const snapshot = await handleAcknowledgment(data, context);

    const documentData = {
      ackEvent: 'acknowledged',
      userId: context.auth!.uid,
      noticeId: snapshot.id,
      type: data.type || 'seen',
      metadata: data.metadata || {},
    };

    const result = await db
      .collection(config.noticesCollection)
      .doc(data.noticeId)
      .collection(config.acknowledgmentsCollection)
      .withConverter(acknowledgmentConverter)
      // @ts-expect-error - cant partially type set arguments in the converter
      .add(documentData);

    await eventChannel?.publish({
      type: `firebase.extensions.firestore-record-user-acknowledgments.v1.acknowledgment`,
      data: JSON.stringify({
        ...documentData,
        id: result.id,
      }),
    });

    logs.acknowledgeNotice(documentData);
  },
);

export const unacknowledgeNotice = functions.https.onCall(
  async (data, context) => {
    const snapshot = await handleAcknowledgment(data, context);

    const documentData = {
      ackEvent: 'unacknowledged',
      userId: context.auth!.uid,
      noticeId: snapshot.id,
      metadata: data.metadata || {},
    };

    const result = await db
      .collection(config.noticesCollection)
      .doc(data.noticeId)
      .collection(config.acknowledgmentsCollection)
      .withConverter(acknowledgmentConverter)
      // @ts-expect-error - cant partially type set arguments in the converter
      .add(documentData);

    await eventChannel?.publish({
      type: `firebase.extensions.firestore-record-user-acknowledgments.v1.unacknowledgment`,
      data: JSON.stringify({
        ...documentData,
        id: result.id,
      }),
    });

    logs.unacknowledgeNotice(documentData);
  },
);

type GetAcknowledgmentsResponse = (Acknowledgment & {
  notice: Omit<Notice, 'allowList'>;
})[];

export const getAcknowledgments = functions.https.onCall(
  async (data, context) => {
    assertAuthenticated(context);

    const uid = context.auth!.uid;

    let query = db
      .collectionGroup(config.acknowledgmentsCollection)
      .where('userId', '==', uid);

    // If `includeUnacknowledgments` is true, we want to include all acknowledgments.
    // By default, this will include on acknowledged.
    if (data.includeUnacknowledgments !== true) {
      query = query.where('ackEvent', '==', 'acknowledged');
    }

    // Get a list of all the acknowledgments for a single user.
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .withConverter(acknowledgmentConverter)
      .get();

    // Return early if no acknowledgments exist.
    if (snapshot.empty) {
      return [];
    }

    const acknowledements = snapshot.docs.map(doc => doc.data());

    const noticeReferences = acknowledements.map(doc =>
      db.collection('notices').doc(doc.noticeId).withConverter(noticeConverter),
    );

    const noticeSnapshots = (await db.getAll(
      ...noticeReferences,
    )) as firestore.DocumentSnapshot<Notice>[];

    const cache = new Map<string, Notice>();

    const response: GetAcknowledgmentsResponse = acknowledements.map(doc => {
      const noticeData =
        cache.get(doc.noticeId) ||
        noticeSnapshots.find(notice => notice.id === doc.noticeId)!.data();

      if (!cache.has(doc.noticeId)) {
        cache.set(doc.noticeId, noticeData);
      }

      const { allowList, ...notice } = noticeData;

      return {
        ...doc,
        notice,
      };
    });

    return response;
  },
);

export const createIndex = functions.https.onRequest(
  createIndexUrlOnRequestHandler,
);
