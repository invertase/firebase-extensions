import { expect } from 'vitest';

export const apiEndpointUrl =
  'http://127.0.0.1:5001/dev-extensions-testing/europe-west2/ext-image-processing-api-handler/process';

export const remoteImgUrl =
  'https://images.unsplash.com/photo-1512546321483-c0468b7b8a95';

export const testTimeout = 15000;

// Enhanced buildUrl to support path URLs
export const buildUrl = (operations = [], usePathUrl = false): string => {
  const inputOperation = usePathUrl
    ? { operation: 'input', type: 'path', path: '/images/photo.jpg' }
    : { operation: 'input', type: 'url', url: remoteImgUrl };

  return `${apiEndpointUrl}?operations=${encodeURIComponent(
    JSON.stringify([
      inputOperation,
      ...operations,
      { operation: 'output', format: 'jpeg' },
    ]),
  )}`;
};

export async function assertOperationSuccess(
  operations: Array<{ operation: string; [key: string]: unknown }>,
  usePathUrl = false,
): Promise<void> {
  const url = buildUrl(operations, usePathUrl);
  const { status } = await fetch(url);

  expect(status).toBe(200);
}
