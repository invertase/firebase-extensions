import { Functions, getFunctions, httpsCallable } from 'firebase/functions';
import {
  AcknowledgeNoticeRequest,
  GetAcknowledgmentsRequest,
  GetAcknowledgmentsResponse,
  GetNoticeRequest,
  GetNoticeResponse,
  UnacknowledgeNoticeRequest,
} from './types';

// Utility to return the callable name with an optional extension id.
function callableName(name: string, extensionId?: string): string {
  return `ext-firestore-record-user-acknowledgements${
    extensionId ? `-${extensionId}` : ''
  }-${name}`;
}

type BaseOptions = {
  functions?: Functions;
  extensionId?: string;
};

export type GetNoticeOptions = BaseOptions & GetNoticeRequest;

// Returns a single notice by type, and optional version.
export async function getNotice({
  functions,
  extensionId,
  type,
  version,
}: GetNoticeOptions): Promise<GetNoticeResponse> {
  const instance = functions || getFunctions();

  const notice = await httpsCallable<GetNoticeRequest, GetNoticeResponse>(
    instance,
    callableName('getNotice', extensionId),
  )({
    type,
    version,
  });

  return notice.data;
}

export type AcknowledgeNoticeOptions = BaseOptions & AcknowledgeNoticeRequest;

// Acknowledges a notice by `noticeId`.
export async function acknowledgeNotice({
  functions,
  extensionId,
  noticeId,
  type,
  metadata,
}: AcknowledgeNoticeOptions): Promise<void> {
  const instance = functions || getFunctions();

  await httpsCallable<AcknowledgeNoticeRequest, void>(
    instance,
    callableName('acknowledgeNotice', extensionId),
  )({
    noticeId,
    type,
    metadata,
  });
}

export type UnacknowledgeNoticeOptions = BaseOptions &
  UnacknowledgeNoticeRequest;

// Unacknowledges a notice by `noticeId`.
export async function unacknowledgeNotice({
  functions,
  extensionId,
  noticeId,
  metadata,
}: UnacknowledgeNoticeOptions): Promise<void> {
  const instance = functions || getFunctions();

  await httpsCallable<UnacknowledgeNoticeOptions, void>(
    instance,
    callableName('unacknowledgeNotice', extensionId),
  )({
    noticeId,
    metadata,
  });
}

export type GetAcknowledgmentsOptions = BaseOptions & GetAcknowledgmentsRequest;

// Returns all acknowledgments for the current user.
export async function getAcknowledgments({
  functions,
  extensionId,
  includeUnacknowledgments,
}: GetAcknowledgmentsOptions): Promise<GetAcknowledgmentsResponse> {
  const instance = functions || getFunctions();

  const acknowledgments = await httpsCallable<
    GetAcknowledgmentsRequest,
    GetAcknowledgmentsResponse
  >(
    instance,
    callableName('getAcknowledgments', extensionId),
  )({
    includeUnacknowledgments,
  });

  return acknowledgments.data;
}
