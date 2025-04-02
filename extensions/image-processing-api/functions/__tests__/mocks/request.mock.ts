// __tests__/mocks/request.mock.ts
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

interface MockRequestOptions {
  headers?: {
    origin?: string;
    referer?: string;
    host?: string;
    [key: string]: string | undefined;
  };
  secure?: boolean;
  [key: string]: any;
}

/**
 * Creates a mock Express Request object for testing
 * @param options Configuration options for the mock request
 * @returns A typed mock Express Request object
 */
export function createMockRequest(
  options: MockRequestOptions = {},
): Request<
  ParamsDictionary,
  unknown,
  unknown,
  ParsedQs,
  Record<string, unknown>
> {
  const mockRequest = {
    headers: {
      origin: 'https://example.com',
      referer: 'https://example.com/some-page',
      host: 'example.com',
      ...(options.headers || {}),
    },
    secure: options.secure !== undefined ? options.secure : true,
    ...options,
  } as Request;

  return mockRequest;
}
