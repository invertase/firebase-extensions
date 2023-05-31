/**
 * A task that can be executed by the inference API.
 *
 * @see {@link https://huggingface.co/docs/api-inference/detailed_parameters|Hugging Face Inference API docs}
 */
export class Task {
  id: string;

  /**
   * Construct a task.
   * @param {string} id the id of the task
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Return the task as a JSON string.
   * @return {string}
   */
  json(): string {
    return JSON.stringify(this);
  }
}

/**
 * A task that fills a mask in a text.
 */
export class FillMaskTask extends Task {
  inputs: string;

  /**
   *
   * @param {string} id
   * @param {string} inputs
   */
  constructor(id: string, inputs: string) {
    super(id);
    if (!this.checkInputsHasMask(inputs))
      throw new Error('Inputs must contain a [MASK]');
    this.inputs = inputs;
  }

  /**
   *
   * @param {string} inputs
   * @return {boolean}
   */
  checkInputsHasMask(inputs: string): boolean {
    if (inputs.includes('[MASK]')) {
      return true;
    } else {
      return false;
    }
  }

  json(): string {
    return JSON.stringify({
      inputs: this.inputs,
    });
  }
}
