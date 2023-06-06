import {
  HfInference,
  HfInferenceEndpoint,
  ZeroShotClassificationOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function zeroShotClassification(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<ZeroShotClassificationOutput> {
  const { inputs, candidate_labels, multi_label } = validateInput(
    snapshot.data(),
  );

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs: inputs,
    parameters: {
      candidate_labels,
      multi_label,
    },
  };

  return inference.zeroShotClassification(options);
}

function validateInput(data: any) {
  const { inputs, candidate_labels, multi_label } = data;

  if (
    !inputs ||
    !(typeof inputs !== 'string') ||
    !(inputs instanceof Array) ||
    inputs.length === 0 ||
    typeof inputs[0] !== 'string'
  ) {
    throw new Error(
      'Field `inputs` must be provided and must be a string or a list of strings',
    );
  }

  return { inputs, candidate_labels, multi_label };
}
