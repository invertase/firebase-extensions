import {
  HfInference,
  HfInferenceEndpoint,
  TextClassificationOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function textClassification(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<TextClassificationOutput> {
  const inputs = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs,
    parameters: {
      return_all_scores: true,
      top_k: null,
    },
  };

  return inference.request<TextClassificationOutput>(options);
}

function validateInput(data: any) {
  const { inputs } = data;

  if (!inputs || typeof inputs !== 'string') {
    throw new Error('Field `inputs` must be provided and must be a string');
  }

  return inputs;
}
