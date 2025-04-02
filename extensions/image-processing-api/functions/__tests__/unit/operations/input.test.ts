// __tests__/unit/operations/input.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest } from '../../mocks/request.mock';
import * as utils from '../../../src/utils';
import { operationInput } from '../../../src/operations';
import { ValidatedOperation, Operation } from '../../../src/types';

// Mock the fetchImageBufferFromUrl function
vi.mock('../../../src/utils', async () => {
  const actual = await vi.importActual('../../../src/utils');
  return {
    ...actual,
    fetchImageBufferFromUrl: vi
      .fn()
      .mockResolvedValue(Buffer.from('fake image data')),
  };
});

describe('operationInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate path input type', () => {
    const input: Operation = {
      operation: 'input',
      type: 'path',
      path: '/images/test.jpg',
    };

    const result = operationInput.validate(input);
    expect(result).toEqual(input);
  });

  it('should build constructor action for path URL', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest();

    const actions = await operationInput.build(operation, null, mockReq);

    expect(actions).toHaveLength(1);
    expect(actions[0].method).toBe('constructor');
    expect(utils.fetchImageBufferFromUrl).toHaveBeenCalledWith(
      'https://example.com/images/test.jpg',
    );
  });

  it('should throw error if request is not provided for path URL', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    await expect(
      operationInput.build(operation, null, undefined),
    ).rejects.toThrow('Request object is required for path type inputs');
  });

  it('should extract hostname from origin header', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest({
      headers: {
        origin: 'https://custom-domain.com',
        referer: 'https://example.com/page',
      },
    });

    await operationInput.build(operation, null, mockReq);

    expect(utils.fetchImageBufferFromUrl).toHaveBeenCalledWith(
      'https://custom-domain.com/images/test.jpg',
    );
  });

  it('should fallback to referer if origin is not available', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest({
      headers: {
        origin: '',
        referer: 'https://from-referer.com/page',
      },
    });

    await operationInput.build(operation, null, mockReq);

    expect(utils.fetchImageBufferFromUrl).toHaveBeenCalledWith(
      'https://from-referer.com/images/test.jpg',
    );
  });

  it('should fallback to host header if origin and referer are not available', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest({
      headers: {
        origin: '',
        referer: '',
        host: 'host-header.com',
      },
      secure: true,
    });

    await operationInput.build(operation, null, mockReq);

    expect(utils.fetchImageBufferFromUrl).toHaveBeenCalledWith(
      'https://host-header.com/images/test.jpg',
    );
  });

  it('should use http protocol if request is not secure', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest({
      headers: {
        origin: '',
        referer: '',
        host: 'host-header.com',
      },
      secure: false,
    });

    await operationInput.build(operation, null, mockReq);

    expect(utils.fetchImageBufferFromUrl).toHaveBeenCalledWith(
      'http://host-header.com/images/test.jpg',
    );
  });

  it('should throw error if no hostname can be determined', async () => {
    const operation: ValidatedOperation = {
      source: '',
      operation: 'input',
      rawOptions: {
        operation: 'input',
        type: 'path',
        path: '/images/test.jpg',
      },
      options: {
        type: 'path',
        path: '/images/test.jpg',
      },
    };

    const mockReq = createMockRequest({
      headers: {
        origin: '',
        referer: '',
        host: '',
      },
    });

    await expect(
      operationInput.build(operation, null, mockReq),
    ).rejects.toThrow('Could not determine request hostname for path URL');
  });
});
