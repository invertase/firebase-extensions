import { describe, expect, test } from '@jest/globals';
import { runHostedInference } from './hosted_inference';
import { Task } from './tasks';

describe(Task.fillMask, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(runHostedInference(snapshot, Task.fillMask)).rejects.toThrow(
      Error,
    );
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(runHostedInference(snapshot, Task.fillMask)).rejects.toThrow(
      Error,
    );
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
      runHostedInference(snapshot, Task.summarization),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, Task.summarization),
    ).rejects.toThrow(Error);
  });
});
