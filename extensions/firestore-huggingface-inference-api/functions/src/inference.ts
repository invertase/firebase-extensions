import * as functions from 'firebase-functions';
import {
  FillMaskOutput,
  SummarizationOutput,
  QuestionAnsweringOutput,
  TableQuestionAnsweringOutput,
  SentenceSimilarityOutput,
  TextClassificationOutput,
  TextGenerationOutput,
  TokenClassificationOutput,
  TranslationOutput,
  ZeroShotClassificationOutput,
  HfInferenceEndpoint,
  HfInference,
  FeatureExtractionOutput,
  ConversationalOutput,
} from '@huggingface/inference';

import config from './config';
import { Task } from './tasks';
import { FirestoreTableInput } from './types/table';
import { conversational } from './tasks/conversational';
import { featureExtraction } from './tasks/feature-extraction';

/**
 * Validate inputs and create a task.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot
 * @return {Task}
 */
export async function runInference(
  snapshot: functions.firestore.DocumentSnapshot,
  task: Task,
  inference: HfInference | HfInferenceEndpoint,
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
  | FeatureExtractionOutput
  | ConversationalOutput
> {
  switch (task) {
    case Task.fillMask: {
      const { inputs } = snapshot.data();

      if (!inputs || typeof inputs !== 'string')
        throw new Error('Field `inputs` must be provided and must be a string');

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
      };

      return await inference.fillMask(options);
    }

    case Task.summarization: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
      };

      return await inference.summarization(options);
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

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: {
          context,
          question,
        },
      };

      return await inference.questionAnswering(options);
    }

    case Task.tableQuestionAnswering: {
      const { inputs } = snapshot.data();
      if (
        !inputs.query ||
        typeof inputs.query !== 'string' ||
        !validateFirestoreInput({ inputs: inputs })
      )
        throw new Error(
          'Field `query` and `table` are required and must be a string and a dictionary respectively',
        );

      return await inference.tableQuestionAnswering({
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
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

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: {
          source_sentence,
          sentences,
        },
      };

      return await inference.sentenceSimilarity(options);
    }

    case Task.textClassification: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
        parameters: {
          return_all_scores: true,
          top_k: null,
        },
      };

      return await inference.request<TextClassificationOutput>(options);
    }

    case Task.textGeneration:
    case Task.text2textGeneration: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
      };

      return await inference.textGeneration(options);
    }

    case Task.tokenClassification:
    case Task.namedEntityRecognition: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
      };

      return await inference.tokenClassification(options);
    }

    case Task.translation: {
      const { inputs } = snapshot.data();
      checkInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
      };

      return await inference.translation(options);
    }
    case Task.zeroShotClassification: {
      const { inputs, candidate_labels, multi_label } = snapshot.data();
      checkListInputs(inputs);

      const options = {
        ...(inference instanceof HfInference && {
          model: config.modelId,
        }),
        inputs: inputs,
        parameters: {
          candidate_labels,
          multi_label,
        },
      };

      return await inference.zeroShotClassification(options);
    }
    case Task.conversational: {
      return await conversational(snapshot, inference);
    }
    case Task.featureExtraction: {
      return await featureExtraction(snapshot, inference);
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

function validateFirestoreInput(data: any): data is FirestoreTableInput {
  if (!data || typeof data !== 'object' || !data.inputs) {
    return false;
  }

  const inputs = data.inputs;

  if (typeof inputs.query !== 'string') {
    return false;
  }

  const table = inputs.table;

  if (!table || typeof table !== 'object') {
    return false;
  }

  // Check all properties of table are string arrays
  for (const key in table) {
    if (
      !Array.isArray(table[key]) ||
      !table[key].every((item: any) => typeof item === 'string')
    ) {
      return false;
    }
  }

  return true;
}
