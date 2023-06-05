import {
  FeatureExtractionOutput,
  HfInference,
  HfInferenceEndpoint,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';

export function featureExtraction(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<FeatureExtractionOutput> {
  throw new Error('Feature Extraction task is not supported yet');
}
