interface TableData {
  [k: string]: string[];
}

interface InferenceInput {
  query: string;
  table: TableData;
}

export interface FirestoreTableInput {
  inputs: InferenceInput;
}
