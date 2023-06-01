import { InvalidArgumentError } from './errors';

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

type Range100 = Range<0, 101>;
type Range120 = Range<0, 121>;

export enum TaskId {
  fill_mask = 'fill-mask',
  summarization = 'summarization',
}

/**
 * A task that can be executed by the inference API.
 *
 * @see {@link https://huggingface.co/docs/api-inference/detailed_parameters|Hugging Face Inference API docs}
 */
export class Task {
  id: TaskId;
  inputs?: string;
  parameters?: Record<string, unknown>;
  options?: Record<string, unknown>;

  /**
   * Construct a task.
   * @param {string} id the id of the task
   */
  constructor(id: TaskId) {
    this.id = id;
  }

  /**
   * Return the task as a JSON string.
   * @return {string}
   */
  json(): string {
    return JSON.stringify({
      inputs: this.inputs,
      options: this.options,
      parameters: this.parameters,
    });
  }
}

/**
 * A task that fills a mask in a text.
 *
 * @see {@link https://huggingface.co/docs/api-inference/detailed_parameters#fill-mask-task|Hugging Face Inference API docs}
 */
export class FillMaskTask extends Task {
  inputs: string;

  /**
   *
   * @param {string} id
   * @param {string} inputs: a string to be filled from, must contain the [MASK] token (check model card for exact name of the mask).
   */
  constructor(
    inputs: string,
    options?: { use_cache?: boolean; wait_for_model?: boolean },
  ) {
    super(TaskId.fill_mask);
    if (!this.checkInputsHasMask(inputs))
      throw new Error('Inputs must contain a [MASK]');
    this.inputs = inputs;
    this.options = options;
  }

  /**
   *
   * @param {string} inputs
   * @return {boolean}
   */
  private checkInputsHasMask(inputs: string): boolean {
    if (inputs.includes('[MASK]')) {
      return true;
    } else {
      return false;
    }
  }
}

/**
 * A task to summarize longer text into shorter text.
 *
 * @see {@link https://huggingface.co/docs/api-inference/detailed_parameters#summarization-task|Hugging Face Inference API docs}
 */
export class SummarizationTask extends Task {
  inputs: string;

  /**
   *
   * @param {string} inputs
   */
  constructor(
    inputs: string,
    parameters?: {
      min_length?: number;
      max_length?: number;
      top_k?: number;
      top_p?: number;
      temperature?: number;
      repetition_penalty?: number;
      max_time?: number;
    },
    options?: { use_cache?: boolean; wait_for_model?: boolean },
  ) {
    super(TaskId.summarization);

    if (parameters?.temperature) {
      this.validateTemperature(parameters.temperature);
    }

    if (parameters?.repetition_penalty) {
      this.validateRepetitionPenalty(parameters.repetition_penalty);
    }

    this.inputs = inputs;
    this.parameters = parameters;
    this.options = options;
  }

  private validateTemperature(temperature: number): void {
    if (!isFloat(temperature) || temperature < 0.0 || temperature > 100.0) {
      throw new InvalidArgumentError(
        '`temperature` must be a number float 0.0 and 100.0',
      );
    }
  }

  private validateRepetitionPenalty(repetition_penalty: number): void {
    if (
      !isFloat(repetition_penalty) ||
      repetition_penalty < 0.0 ||
      repetition_penalty > 100.0
    ) {
      throw new InvalidArgumentError(
        '`repetition_penalty` must be a float between 0.0 and 100.0',
      );
    }
  }
}

function isInt(n: number) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}