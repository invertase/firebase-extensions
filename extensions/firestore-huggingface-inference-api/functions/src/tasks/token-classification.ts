import {
  HfInference,
  HfInferenceEndpoint,
  TokenClassificationOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function tokenClassification(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<TokenClassificationOutput> {
  const inputs = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs,
  };

  return inference.tokenClassification(options);
}

function validateInput(inputs: any) {
  if (!inputs || typeof inputs !== 'string') {
    throw new Error('Field `inputs` must be provided and must be a string');
  }

  return inputs;
}
