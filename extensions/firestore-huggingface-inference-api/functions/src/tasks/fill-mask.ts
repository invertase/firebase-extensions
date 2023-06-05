import {
  FillMaskOutput,
  HfInference,
  HfInferenceEndpoint,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function fillMask(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<FillMaskOutput> {
  const { inputs } = snapshot.data();

  if (!inputs || typeof inputs !== 'string')
    throw new Error('Field `inputs` must be provided and must be a string');

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs: inputs,
  };

  return inference.fillMask(options);
}
