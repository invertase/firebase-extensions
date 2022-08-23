import * as functions from 'firebase-functions';

import { AssertionError } from 'assert';
import { Response } from 'express';
import { applyValidatedOperation } from './operations';
import { ValidatedOperation } from './types';
import { fileMetadataBufferKeys, omitKeys } from './utils';

export async function processImageRequest(
  validatedOperations: ValidatedOperation[],
  res: Response,
): Promise<void> {
  const firstOperation = validatedOperations[0];
  const lastOperation = validatedOperations[validatedOperations.length - 1];

  // Ensure input is the first operation.
  if (firstOperation.operation != 'input') {
    throw new AssertionError({
      message: `An input operation must be the first operation.`,
    });
  }

  // Ensure output is the last operation.
  if (lastOperation.operation != 'output') {
    throw new AssertionError({
      message: `An output operation must be the last operation.`,
    });
  }

  // Apply operations.
  let instance = null;
  for (let i = 0; i < validatedOperations.length; i++) {
    const validatedOperation = validatedOperations[i];
    instance = await applyValidatedOperation(instance, validatedOperation);
  }

  const finalFileMetadata = omitKeys(
    await instance.metadata(),
    fileMetadataBufferKeys,
  );

  if (lastOperation.options.debug == true) {
    res.json({
      operations: validatedOperations,
      metadata: finalFileMetadata,
    });
    return;
  }

  const output = await instance.toBuffer({ resolveWithObject: true });
  const { data, info } = output;

  functions.logger.debug(`Processed a new request.`, validatedOperations);

  const headers = {
    'Content-Type': `image/${info.format}`,
    'Content-Length': Buffer.byteLength(data),
    'Content-Disposition': `inline; filename=image.${info.format}`,
    'Cache-control': 'public, max-age=31536000', // 1 Year
  };

  // Attach output information as response headers.
  Object.entries(info).forEach(entry => {
    headers[`ext-output-info-${entry[0].toLowerCase()}`] = `${entry[1]}`;
  });

  // Attach sharp metadata as response headers.
  Object.entries(finalFileMetadata).forEach(entry => {
    headers[`ext-metadata-${entry[0].toLowerCase()}`] = `${entry[1]}`;
  });

  res.writeHead(200, headers);
  res.end(data);
}
