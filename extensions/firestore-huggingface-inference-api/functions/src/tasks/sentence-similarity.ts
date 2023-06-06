import {
  HfInference,
  HfInferenceEndpoint,
  SentenceSimilarityOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';

export function sentenceSimilarity(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<SentenceSimilarityOutput> {
  const { source_sentence, sentences } = validateInput(snapshot.data());

  const options = {
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs: {
      source_sentence,
      sentences,
    },
  };

  return inference.sentenceSimilarity(options);
}

function validateInput(data: any) {
  const { source_sentence, sentences } = data;

  if (
    !source_sentence ||
    !sentences ||
    typeof source_sentence !== 'string' ||
    !(sentences instanceof Array)
  )
    throw new Error(
      'Field `source_sentence` and `sentences` are required and must be a string and an array of strings respectively',
    );

  return { source_sentence, sentences };
}
