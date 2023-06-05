import {
  HfInference,
  HfInferenceEndpoint,
  TextGenerationOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function textGeneration(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<TextGenerationOutput> {
  const inputs = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs,
  };

  return inference.textGeneration(options);
}

function validateInput(inputs: any) {
  if (!inputs || typeof inputs !== 'string') {
    throw new Error('Field `inputs` must be provided and must be a string');
  }

  return inputs;
}
