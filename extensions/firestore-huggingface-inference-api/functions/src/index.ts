import * as functions from 'firebase-functions';

import config from './config';

import {
  InferenceOutputError,
  HfInferenceEndpoint,
  HfInference,
} from '@huggingface/inference';
import { runInference } from './run_inference';

/**
 * Trigger inference on Firestore document creation.
 */
export const triggerInference = functions.firestore
  .document(`${config.collectionPath}/{documentId}`)
  .onWrite(async snapshot => {
    try {
      if (!snapshot.after.exists) {
        functions.logger.info('Document deleted, skipping inference');
        return;
      }

      let inference: HfInference | HfInferenceEndpoint;

      if (config.inferenceEndpoint) {
        inference = new HfInferenceEndpoint(
          config.inferenceEndpoint,
          config.accessToken,
        );
      } else {
        inference = new HfInference(config.accessToken);
      }

      const response = await runInference(
        snapshot.after,
        config.task,
        inference,
      );

      await snapshot.after.ref.update({ response });
    } catch (error: any) {
      functions.logger.error(error);
      if (error instanceof InferenceOutputError) {
        await snapshot.after.ref.update({
          error: {
            message: error.message,
          },
        });
      } else {
        await snapshot.after.ref.update({
          error:
            error.message ??
            'Unknown error happened, check function logs for more details',
        });
      }
    }
  });
