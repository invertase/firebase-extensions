import * as functions from 'firebase-functions';

import config from './config';

import { InferenceOutputError } from '@huggingface/inference';
import { runHostedInference } from './hosted_inference';

/**
 * Trigger inference on Firestore document creation.
 */
export const triggerInference = functions.firestore
  .document(`${config.collectionName}/{documentId}`)
  .onCreate(async snapshot => {
    try {
      const response = await runHostedInference(snapshot);

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
    }
  });
