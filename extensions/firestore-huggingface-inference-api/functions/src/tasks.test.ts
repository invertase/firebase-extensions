import { describe, expect, test } from '@jest/globals';
import { runHostedInference } from './run_inference';
import { Task } from './tasks';
import { HfInference } from '@huggingface/inference';

const inference = new HfInference('test');

describe(Task.fillMask, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, Task.fillMask, inference),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, Task.fillMask, inference),
    ).rejects.toThrow(Error);
  });
});

describe(Task.summarization, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, Task.summarization, inference),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, Task.summarization, inference),
    ).rejects.toThrow(Error);
  });
});
