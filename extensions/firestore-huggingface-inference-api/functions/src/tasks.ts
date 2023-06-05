export enum TaskId {
  fillMask = 'fill-mask',
  summarization = 'summarization',
  questionAnswering = 'question-answering',
  tableQuestionAnswering = 'table-question-answering',
  sentenceSimilarity = 'sentence-similarity',
  textClassification = 'text-classification',
  textGeneration = 'text-generation',
  text2textGeneration = 'text2text-generation',
  tokenClassification = 'token-classification',
  namedEntityRecognition = 'named-entity-recognition',
  translation = 'translation',
  zeroShotClassification = 'zeroshot-classification',
  conversational = 'conversational',
  featureExtraction = 'feature-extraction',
}

export { conversational } from './tasks/conversational';
export { featureExtraction } from './tasks/feature-extraction';
export { fillMask } from './tasks/fill-mask';
export { questionAnswering } from './tasks/question-answering';
export { sentenceSimilarity } from './tasks/sentence-similarity';
export { summarization } from './tasks/summarization';
export { tableQuestionAnswering } from './tasks/table-question-answering';
export { textClassification } from './tasks/text-classification';
export { textGeneration } from './tasks/text-generation';
export { tokenClassification } from './tasks/token-classification';
export { translation } from './tasks/translation';
export { zeroShotClassification } from './tasks/zero-shot-classification';
