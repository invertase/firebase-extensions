import * as functions from 'firebase-functions';
import {
  FillMaskOutput,
  SummarizationOutput,
  fillMask,
  summarization,
} from '@huggingface/inference';

import config from './config';
import { FillMaskTask, SummarizationTask, Task, TaskId } from './tasks';
import { InferenceOutputError } from '@huggingface/inference';

/**
 * Validate inputs and create a task.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
async function run(
  snapshot: functions.firestore.DocumentSnapshot,
): Promise<FillMaskOutput | SummarizationOutput> {
  let task: Task;
  const { inputs } = snapshot.data();

  if (!inputs)
    throw new Error('Field `inputs` must be provided and must be a string');

  switch (config.task) {
    case TaskId.fill_mask:
      try {
        task = new FillMaskTask(inputs);
        return await fillMask({
          model: config.modelId,
          inputs: task.inputs,
        });
      } catch (error: any) {
        functions.logger.error(error.message, error);
        snapshot.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });
        throw error;
      }

    case TaskId.summarization:
      try {
        task = new SummarizationTask(inputs);

        return await summarization({
          model: config.modelId,
          inputs: task.inputs,
          parameters: task.parameters,
        });
      } catch (error: any) {
        functions.logger.error(error.message, error);
        snapshot.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });

        throw error;
      }

    default:
      snapshot.ref.update({ error: 'Invalid task' });
      throw new Error('Invalid task');
  }
}

/**
 * Trigger inference on Firestore document creation.
 */
export const triggerInference = functions.firestore
  .document(`${config.collectionName}/{documentId}`)
  .onCreate(async snapshot => {
    try {
      const response = await run(snapshot);

      console.log(response);

      await snapshot.ref.update({ response });
    } catch (error: any) {
      functions.logger.error(error);
      if (error instanceof InferenceOutputError) {
        await snapshot.ref.update({
          error: {
            message: error.message,
          },
        });
      } else {
        await snapshot.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });
      }

      return;
    }
  });
