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
  textClassification,
  TextClassificationOutput,
  textGeneration,
  TextGenerationOutput,
  tokenClassification,
  TokenClassificationOutput,
  translation,
  TranslationOutput,
  ZeroShotClassificationOutput,
  zeroShotClassification,
} from '@huggingface/inference';

import config from './config';
import { Task } from './tasks';

/**
 * Validate inputs and create a task.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
export async function runHostedInference(
  snapshot: functions.firestore.DocumentSnapshot,
  task?: Task,
): Promise<
  | FillMaskOutput
  | SummarizationOutput
  | QuestionAnsweringOutput
  | TableQuestionAnsweringOutput
  | SentenceSimilarityOutput
  | TextClassificationOutput
  | TextGenerationOutput
  | TokenClassificationOutput
  | TranslationOutput
  | ZeroShotClassificationOutput
> {
  switch (task) {
    case Task.fillMask: {
      const { inputs } = snapshot.data();

      if (!inputs || typeof inputs !== 'string')
        throw new Error('Field `inputs` must be provided and must be a string');

      return await fillMask({
        model: config.modelId,
        inputs: inputs,
      });
    }
    case Task.summarization: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      return await summarization({
        model: config.modelId,
        inputs: inputs,
      });
    }

    case Task.questionAnswering: {
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

    case Task.tableQuestionAnswering: {
      const { query, table } = snapshot.data() as {
        query?: string;
        table?: Record<string, string[]>;
      };

      if (!query || !table || typeof query !== 'string')
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

    case Task.sentenceSimilarity: {
      const { source_sentence, sentences } = snapshot.data();

      if (
        !source_sentence ||
        !sentences ||
        typeof source_sentence !== 'string' ||
        !(sentences instanceof Array)
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

    case Task.textClassification: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      return await textClassification({
        model: config.modelId,
        inputs: inputs,
      });
    }

    case Task.textGeneration:
    case Task.text2textGeneration: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      return await textGeneration({
        model: config.modelId,
        inputs: inputs,
      });
    }

    case Task.tokenClassification:
    case Task.namedEntityRecognition: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      return await tokenClassification({
        model: config.modelId,
        inputs: inputs,
      });
    }

    case Task.translation: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      return await translation({
        model: config.modelId,
        inputs: inputs,
      });
    }
    case Task.zeroShotClassification: {
      const { inputs, candidate_labels, multi_label } = snapshot.data();
      checkListInputs(inputs);

      return await zeroShotClassification({
        model: config.modelId,
        inputs,
        parameters: {
          candidate_labels,
          multi_label,
        },
      });
    }
    case Task.conversational: {
      throw new Error('Conversational task is not supported yet');
    }
    case Task.featureExtraction: {
      throw new Error('Feature extraction task is not supported yet');
    }

    default: {
      snapshot.ref.update({ error: 'Invalid task' });
      throw new Error('Invalid task');
    }
  }
}

function checkInputs(inputs: any) {
  if (!inputs || typeof inputs !== 'string') {
    throw new Error('Field `inputs` must be provided and must be a string');
  }
}

function checkListInputs(inputs: any) {
  if (
    !inputs ||
    !(typeof inputs !== 'string') ||
    !(inputs instanceof Array) ||
    inputs.length === 0 ||
    typeof inputs[0] !== 'string'
  ) {
    throw new Error(
      'Field `inputs` must be provided and must be a string or a list of strings',
    );
  }
}
