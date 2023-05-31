import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

import config from './config';
import { FillMaskTask, Task } from './tasks';

const host = 'api-inference.huggingface.co';

/**
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
function validateInputs(
  snapshot: functions.firestore.DocumentSnapshot,
): Task | undefined {
  let task: FillMaskTask;

  switch (config.task) {
    case 'fill-mask':
      try {
        const { inputs } = snapshot.data();
        if (!inputs)
          throw new Error(
            'Field `inputs` must be provided and must be a string',
          );
        task = new FillMaskTask(config.task, inputs);
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

export const triggerInference = functions.firestore
  .document(`${config.collectionName}/{documentId}`)
  .onCreate(async snapshot => {
    const task = validateInputs(snapshot);

    if (!task) return;

    const response = await callHFInferenceAPI(task);

    if (!response.ok) {
      functions.logger.error(response.statusText);
      snapshot.ref.update({ error: response.statusText });
    }

    const output = await response.json();
    snapshot.ref.update({ output });
  });
