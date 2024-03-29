import {
  ConversationalOutput,
  HfInference,
  HfInferenceEndpoint,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';

export function conversational(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<ConversationalOutput> {
  throw new Error('Conversational task is not supported yet');
}
