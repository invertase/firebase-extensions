import { describe, expect, test } from '@jest/globals';
import { FillMaskTask, SummarizationTask } from './tasks';
import { InvalidArgumentError } from './errors';

describe('Fill Mask Task', () => {
  test('Reject inputs with no [MASK]', () => {
    expect(() => new FillMaskTask('Hello World')).toThrow(
      'Inputs must contain a [MASK]',
    );
  });

  test('Accept inputs with correct [MASK]', () => {
    expect(() => new FillMaskTask('Hello World [MASK]')).toBeTruthy();
  });

  test('Options are set correctly', () => {
    const task = new FillMaskTask('Hello World [MASK]', {
      use_cache: true,
      wait_for_model: false,
    });

    expect(task.options).toEqual({ use_cache: true, wait_for_model: false });
  });

  test('Options are included in json', () => {
    const task = new FillMaskTask('Hello World [MASK]', {
      use_cache: true,
      wait_for_model: false,
    });

    expect(task.json()).toEqual(
      JSON.stringify({
        inputs: 'Hello World [MASK]',
        options: { use_cache: true, wait_for_model: false },
      }),
    );
  });
});

describe('Test Summarization Task', () => {
  test('Options are set correctly', () => {
    const task = new FillMaskTask('Hello World [MASK]', {
      use_cache: true,
      wait_for_model: false,
    });

    expect(task.options).toEqual({ use_cache: true, wait_for_model: false });
  });

  test('Options are included in json', () => {
    const task = new FillMaskTask('Hello World [MASK]', {
      use_cache: true,
      wait_for_model: false,
    });

    expect(task.json()).toEqual(
      JSON.stringify({
        inputs: 'Hello World [MASK]',
        options: { use_cache: true, wait_for_model: false },
      }),
    );
  });

  test('Parameters are set correctly', () => {
    const task = new SummarizationTask('Hello World', {
      min_length: 10,
      max_length: 20,
    });

    expect(task.parameters).toEqual({
      min_length: 10,
      max_length: 20,
    });
  });

  test('Parameters are included in json', () => {
    const task = new SummarizationTask('Hello World', {
      min_length: 10,
      max_length: 20,
    });

    expect(task.json()).toEqual(
      JSON.stringify({
        inputs: 'Hello World',
        parameters: { min_length: 10, max_length: 20 },
      }),
    );
  });

  test('`temperature` argument only accepts floats between 0.0 and 100.0', () => {
    expect(
      () => new SummarizationTask('Hello World', { temperature: -1 }),
    ).toThrow(InvalidArgumentError);

    expect(
      () => new SummarizationTask('Hello World', { temperature: 101 }),
    ).toThrow(InvalidArgumentError);

    expect(
      () => new SummarizationTask('Hello World', { temperature: 50 }),
    ).toThrow(InvalidArgumentError);

    expect(
      () => new SummarizationTask('Hello World', { temperature: 50.1 }),
    ).toBeTruthy();
  });
});
