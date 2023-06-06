import {
  HfInference,
  HfInferenceEndpoint,
  TranslationOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function translation(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<TranslationOutput> {
  const inputs = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs,
  };

  return inference.translation(options);
}

function validateInput(inputs: any) {
  if (!inputs || typeof inputs !== 'string') {
    throw new Error('Field `inputs` must be provided and must be a string');
  }

  return inputs;
}
