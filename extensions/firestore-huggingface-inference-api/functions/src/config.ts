import { TaskId } from './tasks';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default {
  collectionName: process.env.COLLECTION_NAME!,
  location: process.env.LOCATION!,
  apiToken: process.env.HF_API_TOKEN!,
  modelId: process.env.MODEL_ID!,
  task: process.env.TASK! as TaskId,
};
