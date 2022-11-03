import type { Timestamp } from 'firebase/firestore';

export interface NoticeDocument {
  // The document ID.
  id: string;
  // The type of notice, e.g. `banner` | `terms-and-condition` | `privacy-policy`.
  type: string;
  // An optional notice version. This can be used to filter a specific notice versions via the `getNotice` callable function.
  version?: number;
  // The optional title of the notice.
  title?: string;
  // The optional description of the notice.
  description?: string;
  // The optional link of the notice.
  link?: string;
  // The timestamp when the notice was created.
  createdAt: Timestamp;
  // A list of user IDs that are allowed to see the notice.
  allowList: string[];
}

type BaseAcknowledgment = {
  // The document ID.
  id: string;
  // The UID of the user who acknowledged the notice.
  userId: string;
  // The ID of the notice that was acknowledged.
  noticeId: string;
  // The timestamp when the notice was acknowledged.
  createdAt: Timestamp;
  // The optional metadata of the acknowledgment.
  metadata: any;
};

export type AcknowledgmentDocument =
  | (BaseAcknowledgment & {
      // The type of the acknowledgment.
      ackEvent: 'acknowledged';
      // The type of the acknowledgment. Defaults to `seen`.
      type: string;
    })
  | (BaseAcknowledgment & {
      // The type of the acknowledgment.
      ackEvent: 'unacknowledged';
    });

export interface GetNoticeRequest {
  // The `type` of the notice to get.
  type: string;
  // If provided, the specific version of this notice (if exists) will be returned.
  version?: number;
}

export type GetNoticeResponse = Omit<NoticeDocument, 'allowList'> & {
  // The timestamp when the notice was unacknowledged by the user (undefined if the user has not unacknowledged this notice).
  unacknowledgedAt?: Timestamp;

  // An ordered array of acknowledgments.
  acknowledgments: AcknowledgmentDocument[];
};

export interface AcknowledgeNoticeRequest {
  // The notice ID to acknowledge.
  noticeId: string;
  // A custom type to provide as the acknowledgment. Defaults to `seen`.
  type?: string;
  // Optional preference metadata to store with this acknowledgment.
  metadata?: any;
}

export interface UnacknowledgeNoticeRequest {
  // The notice ID to unacknowledge.
  noticeId: string;
  // Optional preference metadata to store with this unacknowledgment.
  metadata?: any;
}

export type GetAcknowledgmentsResponse = (AcknowledgmentDocument & {
  // The notice of this acknowledgment, excluding the allowList.
  notice: Omit<NoticeDocument, 'allowList'>;
})[];

export interface GetAcknowledgmentsRequest {
  // If you wish to include unacknowledged notices, set this to true.
  includeUnacknowledgments?: boolean;
}
