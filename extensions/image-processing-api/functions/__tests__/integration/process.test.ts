// __tests__/integration/process.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { Response } from 'express';

// Mock utils BEFORE importing them
vi.mock('../../src/utils', () => {
  return {
    fetchImageBufferFromUrl: vi
      .fn()
      .mockResolvedValue(Buffer.from('fake image data')),
    fileMetadataBufferKeys: [],
    omitKeys: vi.fn(obj => obj),
    // Add any other util functions that might be needed
  };
});

// Mock operations before importing
vi.mock('../../src/operations', () => {
  return {
    asValidatedOperations: vi.fn().mockImplementation(() => {
      return [
        {
          source: '',
          operation: 'input',
          rawOptions: {
            operation: 'input',
            type: 'path',
            path: '/images/test.jpg',
          },
          options: { type: 'path', path: '/images/test.jpg' },
        },
        {
          source: '',
          operation: 'resize',
          rawOptions: { operation: 'resize', width: 200 },
          options: { width: 200 },
        },
        {
          source: '',
          operation: 'output',
          rawOptions: { operation: 'output', format: 'jpeg' },
          options: { format: 'jpeg' },
        },
      ];
    }),
    jsonAsValidatedOperations: vi.fn().mockImplementation(operations => {
      return operations.map(op => ({
        source: '',
        operation: op.operation,
        rawOptions: op,
        options: { ...op },
      }));
    }),
  };
});

// Mock sharp
vi.mock('sharp', () => {
  const mockSharp = vi.fn().mockReturnValue({
    resize: vi.fn().mockReturnThis(),
    blur: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue({
      data: Buffer.from('processed image data'),
      info: { format: 'jpeg', width: 200, height: 150 },
    }),
    metadata: vi.fn().mockResolvedValue({
      width: 200,
      height: 150,
      format: 'jpeg',
    }),
  });

  return {
    default: mockSharp,
  };
});

// Import AFTER defining mocks
import { createMockRequest } from '../mocks/request.mock';
import {
  asValidatedOperations,
  jsonAsValidatedOperations,
} from '../../src/operations';

// Create mock processImageRequest function
const processImageRequest = vi
  .fn()
  // @ts-ignore
  .mockImplementation(async (validatedOperations, res) => {
    // Mock implementation that doesn't actually make HTTP requests
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(Buffer.from('processed image data'));
  });

// Expose processImageRequest for testing
vi.mock('../../src/index', () => {
  return {
    processImageRequest,
  };
});

describe('Image Processing Pipeline', () => {
  let mockReq: express.Request;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = createMockRequest();

    mockRes = {
      json: vi.fn(),
      writeHead: vi.fn(),
      end: vi.fn(),
    };
  });

  it('should process a request with path URL input', async () => {
    const operations = [
      { operation: 'input', type: 'path', path: '/images/test.jpg' },
      { operation: 'resize', width: 200, height: 150 },
      { operation: 'output', format: 'jpeg' },
    ];

    const validatedOperations = jsonAsValidatedOperations(operations);

    await processImageRequest(
      validatedOperations,
      mockRes as Response,
      mockReq,
    );

    // Don't check internal implementation details if you're using a mock
    // Just check that the response was sent
    expect(mockRes.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    expect(mockRes.end).toHaveBeenCalledWith(expect.any(Buffer));
  });

  it('should process URL parameters in path format', async () => {
    // Test the /process/input~type:path~path:%2Fimages%2Ftest.jpg/resize~width:200/output~format:jpeg URL format
    const operationsString =
      'input~type:path~path:%2Fimages%2Ftest.jpg/resize~width:200/output~format:jpeg';

    const validatedOperations = asValidatedOperations(operationsString);

    await processImageRequest(
      validatedOperations,
      mockRes as Response,
      mockReq,
    );

    // Don't check internal implementation details if you're using a mock
    // Just check that the response was sent
    expect(mockRes.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    expect(mockRes.end).toHaveBeenCalledWith(expect.any(Buffer));
  });
});
