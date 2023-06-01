import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

import config from './config';
import { FillMaskTask, SummarizationTask, Task, TaskId } from './tasks';

const host = 'api-inference.huggingface.co';

/**
 * Validate inputs and create a task.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
function validateInputs(
  snapshot: functions.firestore.DocumentSnapshot,
): Task | undefined {
  let task: Task;
  const { inputs } = snapshot.data();

  if (!inputs)
    throw new Error('Field `inputs` must be provided and must be a string');

  switch (config.task) {
    case TaskId.fill_mask:
      try {
        task = new FillMaskTask(inputs);
      } catch (error: any) {
        functions.logger.error(error.message, error);
        snapshot.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });
        return undefined;
      }

      break;
    case TaskId.summarization:
      try {
        task = new SummarizationTask(inputs);
      } catch (error: any) {
        functions.logger.error(error.message, error);
        snapshot.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });
        return undefined;
      }
      break;

    default:
      snapshot.ref.update({ error: 'Invalid task' });
      return undefined;
  }

  return task;
}
/**
 * Call Hugging Face inference API.
 *
 * @param {Task} task
 * @return {Promise<Response>}
 */
function callHFInferenceAPI(task: Task) {
  return fetch(`https://${host}/models/${config.modelId}`, {
    headers: { Authorization: `Bearer ${config.apiToken}` },
    method: 'POST',
    body: task.json(),
  });
}

/**
 * Trigger inference on Firestore document creation.
 */
export const triggerInference = functions.firestore
  .document(`${config.collectionName}/{documentId}`)
  .onCreate(async snapshot => {
    const task = validateInputs(snapshot);

    if (!task) return;

    const response = await callHFInferenceAPI(task);
    const output = await response.json();

    if (!response.ok) {
      functions.logger.error(output.error, output);
      await snapshot.ref.update({ error: output.error ?? 'Unknown error' });

      return;
    }

    await snapshot.ref.update({ output });
  });
