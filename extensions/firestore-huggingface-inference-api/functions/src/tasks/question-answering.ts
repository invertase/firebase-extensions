import {
  HfInference,
  HfInferenceEndpoint,
  QuestionAnsweringOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function questionAnswering(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<QuestionAnsweringOutput> {
  const { question, context } = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs: {
      context,
      question,
    },
  };

  return inference.questionAnswering(options);
}

function validateInput(data: any) {
  const { question, context } = data;

  if (
    !question ||
    !context ||
    typeof question !== 'string' ||
    typeof context !== 'string'
  ) {
    throw new Error('Field `inputs` must be provided and must be a string');
  }

  return { question, context };
}
