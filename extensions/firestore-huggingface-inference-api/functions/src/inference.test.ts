import { describe, expect, test } from '@jest/globals';
import { runInference } from './run_inference';
import { Task } from './tasks';
import { HfInference, HfInferenceEndpoint } from '@huggingface/inference';
import { DocumentSnapshot } from 'firebase-admin/firestore';

const inference = new HfInference('test');

jest.mock('@huggingface/inference', () => ({
  HfInference: jest.fn().mockImplementation(() => ({
    fillMask: jest.fn(),
    summarization: jest.fn(),
    questionAnswering: jest.fn(),
    tableQuestionAnswering: jest.fn(),
  })),
  HfInferenceEndpoint: jest.fn().mockImplementation(() => ({
    fillMask: jest.fn(),
    summarization: jest.fn(),
    questionAnswering: jest.fn(),
    tableQuestionAnswering: jest.fn(),
  })),
}));

describe(Task.fillMask, () => {
  test('should throw an error if inputs are not provided', async () => {
    const snapshot = {
      data: () => ({
        inputs: undefined,
      }),
    } as any;

    await expect(
      runInference(snapshot, Task.fillMask, inference),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runInference(snapshot, Task.fillMask, inference),
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
      runInference(snapshot, Task.summarization, inference),
    ).rejects.toThrow(Error);
  });

  test('should throw an error if inputs are not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: 123,
      }),
    } as any;

    await expect(
      runInference(snapshot, Task.summarization, inference),
    ).rejects.toThrow(Error);
  });
});

// Testing questionAnswering task.
describe(Task.questionAnswering, () => {
  let mockTask: Task;
  let inference: HfInference | HfInferenceEndpoint;

  beforeAll(() => {
    mockTask = Task.questionAnswering;
    inference = new HfInference();
  });

  it('should run without errors', async () => {
    const snapshot = {
      data: () => ({
        question: 'Who are you?',
        context: 'You are a cat.',
      }),
    } as any;

    await expect(
      runInference(snapshot, mockTask, inference),
    ).resolves.not.toThrow();
  });

  it('should throw if `question` and `context` are not provided', async () => {
    const snapshot = {
      data: () => ({}),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should throw if `question` is not a string', async () => {
    const snapshot = {
      data: () => ({
        question: 123,
      }),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should throw if `context` is not a string', async () => {
    const snapshot = {
      data: () => ({
        context: 123,
      }),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should run with inference endpoint', async () => {
    const snapshot = {
      data: () => ({
        question: 'Who are you?',
        context: 'You are a cat.',
      }),
    } as any;

    inference = new HfInferenceEndpoint('https://endpoint-url.com');

    await expect(
      runInference(snapshot, mockTask, inference),
    ).resolves.not.toThrow();
  });
});

// Testing tableQuestionAnswering task.
describe(Task.tableQuestionAnswering, () => {
  let mockTask: Task;
  let inference: HfInference | HfInferenceEndpoint;
  const snapshot = {
    data: () => ({
      inputs: {
        query: 'Who are you?',
        table: {
          name: ['John', 'Mary'],
          age: ['20', '30'],
        },
      },
    }),
  } as any;

  beforeAll(() => {
    mockTask = Task.tableQuestionAnswering;
    inference = new HfInference();
  });

  it('should run without errors', async () => {
    await expect(
      runInference(snapshot, mockTask, inference),
    ).resolves.not.toThrow();
  });

  it('should throw if `question` and `table` are not provided', async () => {
    const snapshot = {
      data: () => ({}),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should throw if `query` is not a string', async () => {
    const snapshot = {
      data: () => ({
        inputs: {
          query: 123,
          table: {
            name: ['John', 'Mary'],
            age: ['20', '30'],
          },
        },
      }),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should throw if `table` is not valid', async () => {
    const snapshot = {
      data: () => ({
        inputs: {
          query: '123',
          table: 123,
        },
      }),
    } as any;

    await expect(runInference(snapshot, mockTask, inference)).rejects.toThrow();
  });

  it('should run with inference endpoint', async () => {
    inference = new HfInferenceEndpoint('https://endpoint-url.com');

    await expect(
      runInference(snapshot, mockTask, inference),
    ).resolves.not.toThrow();
  });
});
