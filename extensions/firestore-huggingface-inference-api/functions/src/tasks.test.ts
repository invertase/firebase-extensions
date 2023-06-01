import { describe, expect, test } from '@jest/globals';
import { runHostedInference } from './hosted_inference';
import { TaskId } from './tasks';

describe(TaskId.fillMask, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(runHostedInference(snapshot, TaskId.fillMask)).rejects.toThrow(
      Error,
    );
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(runHostedInference(snapshot, TaskId.fillMask)).rejects.toThrow(
      Error,
    );
  });
});

describe(TaskId.summarization, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, TaskId.summarization),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runHostedInference(snapshot, TaskId.summarization),
    ).rejects.toThrow(Error);
  });
});
