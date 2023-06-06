import {
  HfInference,
  HfInferenceEndpoint,
  TableQuestionAnsweringOutput,
} from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import config from '../config';
import { FirestoreTableInput } from '../types/table';

export function tableQuestionAnswering(
  snapshot: DocumentSnapshot,
  inference: HfInference | HfInferenceEndpoint,
): Promise<TableQuestionAnsweringOutput> {
  const { inputs } = validateInput(snapshot.data());

  return inference.tableQuestionAnswering({
    ...(inference instanceof HfInference && {
      model: config.modelId,
    }),
    inputs: inputs,
  });
}

function validateInput(data: any) {
  const { inputs } = data;

  if (
    !inputs.query ||
    typeof inputs.query !== 'string' ||
    !validateFirestoreInput({ inputs: inputs })
  )
    throw new Error(
      'Field `query` and `table` are required and must be a string and a dictionary respectively',
    );

  return { inputs };
}

function validateFirestoreInput(data: any): data is FirestoreTableInput {
  if (!data || typeof data !== 'object' || !data.inputs) {
    return false;
  }

  const inputs = data.inputs;

  if (typeof inputs.query !== 'string') {
    return false;
  }

  const table = inputs.table;

  if (!table || typeof table !== 'object') {
    return false;
  }

  // Check all properties of table are string arrays
  for (const key in table) {
    if (
      !Array.isArray(table[key]) ||
      !table[key].every((item: any) => typeof item === 'string')
    ) {
      return false;
    }
  }

  return true;
}
