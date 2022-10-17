import {
  FieldValue,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase-admin/firestore';

import { Notice, Acknowledgment } from './interface';

export const noticeConverter: FirestoreDataConverter<Notice> = {
  toFirestore(notice: any): FirebaseFirestore.DocumentData {
    throw new Error('Creating a notice is not supported.');
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const data = snapshot.data();

    // TODO throw if data is invalid?
    return {
      id: snapshot.id,
      type: data.type,
      title: data.title,
      version: data.version,
      description: data.description,
      link: data.link,
      createdAt: data.createdAt,
      allowList: data.allowList || [],
    };
  },
};

export const acknowledgmentConverter: FirestoreDataConverter<Acknowledgment> = {
  toFirestore(
    data: WithFieldValue<Acknowledgment>,
  ): FirebaseFirestore.DocumentData {
    const acknowledgment = {
      createdAt: FieldValue.serverTimestamp(),
      ackEvent: data.ackEvent,
      userId: data.userId,
      noticeId: data.noticeId,
      metadata: data.metadata,
    };

    if (data.ackEvent === 'acknowledged') {
      return {
        ...acknowledgment,
        type: data.type || 'seen',
      };
    }

    return acknowledgment;
  },
  fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot) {
    const data = snapshot.data();

    const acknowledgment = {
      id: snapshot.id,
      userId: data.userId,
      noticeId: data.noticeId,
      createdAt: data.createdAt,
      metadata: data.metadata || {},
      ackEvent: data.ackEvent,
    };

    if (data.ackEvent === 'acknowledged') {
      return {
        ...acknowledgment,
        type: data.type,
      };
    }

    return acknowledgment;
  },
};
