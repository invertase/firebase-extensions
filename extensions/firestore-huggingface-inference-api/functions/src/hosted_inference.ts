import * as functions from 'firebase-functions';
import {
  FillMaskOutput,
  SummarizationOutput,
  fillMask,
  summarization,
  questionAnswering,
  QuestionAnsweringOutput,
  tableQuestionAnswering,
  TableQuestionAnsweringOutput,
  sentenceSimilarity,
  SentenceSimilarityOutput,
} from '@huggingface/inference';

import config from './config';
import { TaskId } from './tasks';

/**
 * Validate inputs and create a task.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
export async function runHostedInference(
  snapshot: functions.firestore.DocumentSnapshot,
  task?: TaskId,
): Promise<
  | FillMaskOutput
  | SummarizationOutput
  | QuestionAnsweringOutput
  | TableQuestionAnsweringOutput
  | SentenceSimilarityOutput
> {
  switch (task) {
    case TaskId.fillMask: {
      const { inputs } = snapshot.data();

      if (!inputs || typeof inputs !== 'string')
        throw new Error('Field `inputs` must be provided and must be a string');

      return await fillMask({
        model: config.modelId,
        inputs: inputs,
      });
    }
    case TaskId.summarization: {
      const { inputs } = snapshot.data();

      if (!inputs || typeof inputs !== 'string')
        throw new Error('Field `inputs` must be provided and must be a string');

      return await summarization({
        model: config.modelId,
        inputs: inputs,
      });
    }

    case TaskId.questionAnswering: {
      const { question, context } = snapshot.data();

      if (
        !question ||
        !context ||
        typeof question !== 'string' ||
        typeof context !== 'string'
      )
        throw new Error(
          'Field `question` must be provided and must be a string',
        );

      return await questionAnswering({
        model: config.modelId,
        inputs: {
          context,
          question,
        },
      });
    }

    case TaskId.tableQuestionAnswering: {
      const { query, table } = snapshot.data();

      if (
        !query ||
        !table ||
        typeof query !== 'string' ||
        table instanceof Array
      )
        throw new Error(
          'Field `query` and `table` are required and must be a string and an array of strings respectively',
        );

      return await tableQuestionAnswering({
        model: config.modelId,
        inputs: {
          query,
          table,
        },
      });
    }

    case TaskId.sentenceSimilarity: {
      const { source_sentence, sentences } = snapshot.data();

      if (
        !source_sentence ||
        !sentences ||
        typeof source_sentence !== 'string' ||
        sentences instanceof Array
      )
        throw new Error(
          'Field `source_sentence` and `sentences` are required and must be a string and an array of strings respectively',
        );

      return await sentenceSimilarity({
        model: config.modelId,
        inputs: {
          source_sentence,
          sentences,
        },
      });
    }

    case TaskId.textClassification: {
      throw new Error('Text Classification is not yet supported');
    }

    default: {
      snapshot.ref.update({ error: 'Invalid task' });
      throw new Error('Invalid task');
    }
  }
}
