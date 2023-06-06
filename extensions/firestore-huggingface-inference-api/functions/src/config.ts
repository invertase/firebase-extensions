import { TaskId } from './tasks';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default {
  collectionPath: process.env.COLLECTION_PATH!,
  location: process.env.LOCATION!,
  accessToken: process.env.HF_ACCESS_TOKEN!,
  modelId: process.env.MODEL_ID!,
  task: process.env.TASK! as TaskId,
  inferenceEndpoint: process.env.HF_INFERENCE_ENDPOINT,
};
