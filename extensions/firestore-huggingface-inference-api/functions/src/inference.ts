import {
  ConversationalOutput,
  FeatureExtractionOutput,
  FillMaskOutput,
  HfInference,
  HfInferenceEndpoint,
  QuestionAnsweringOutput,
  SentenceSimilarityOutput,
  SummarizationOutput,
  TableQuestionAnsweringOutput,
  TextClassificationOutput,
  TextGenerationOutput,
  TokenClassificationOutput,
  TranslationOutput,
  ZeroShotClassificationOutput,
} from '@huggingface/inference';
import * as functions from 'firebase-functions';

import * as tasks from './tasks';
import { TaskId } from './tasks';

type InferenceOutput =
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
  | ConversationalOutput;

/**
 * Validate the input and run inference.
 *
 * @param {functions.firestore.DocumentSnapshot} snapshot The Firestore snapshot.
 * @return {InferenceOutput} The inference output based on the specified task.
 */
export async function runInference(
  snapshot: functions.firestore.DocumentSnapshot,
  task: TaskId,
  inference: HfInference | HfInferenceEndpoint,
): Promise<InferenceOutput> {
  switch (task) {
    case TaskId.fillMask: {
      return tasks.fillMask(snapshot, inference);
    }

    case TaskId.summarization: {
      return tasks.summarization(snapshot, inference);
    }

    case TaskId.questionAnswering: {
      return tasks.questionAnswering(snapshot, inference);
    }

    case TaskId.tableQuestionAnswering: {
      return tasks.tableQuestionAnswering(snapshot, inference);
    }

    case TaskId.sentenceSimilarity: {
      return tasks.sentenceSimilarity(snapshot, inference);
    }

    //Some text classification Models return a 2-dimensional array of JSON objects in textClassification task 
    //firestore cannot handle 2D arrays (3 INVALID_ARGUMENT: Cannot convert an array value in an array value)
    case TaskId.textClassification: {
      const data= await tasks.textClassification(snapshot, inference);
      return data.flat(Infinity);
    }

    // Text generation and text2text are currently the same.
    // See https://huggingface.co/docs/api-inference/detailed_parameters#text2text-generation-task
    case TaskId.textGeneration:
    case TaskId.text2textGeneration: {
      return tasks.textGeneration(snapshot, inference);
    }

    // Token Classification and Named Entity Recognition are currently the same.
    // See https://huggingface.co/docs/api-inference/detailed_parameters#named-entity-recognition-ner-task
    case TaskId.tokenClassification:
    case TaskId.namedEntityRecognition: {
      return await tasks.tokenClassification(snapshot, inference);
    }

    case TaskId.translation: {
      return tasks.translation(snapshot, inference);
    }

    case TaskId.zeroShotClassification: {
      return tasks.zeroShotClassification(snapshot, inference);
    }
    case TaskId.conversational: {
      return tasks.conversational(snapshot, inference);
    }
    case TaskId.featureExtraction: {
      return tasks.featureExtraction(snapshot, inference);
    }
  }
}
