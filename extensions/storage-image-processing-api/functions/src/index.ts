/*
 * Copyright (c) 2016-present Invertase Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AssertionError } from 'assert';

import a2a from 'a2a';
import { applyValidatedOperation, asValidatedOperations } from './operations';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as functions from 'firebase-functions';
import { StructError } from 'superstruct';
import {
  expressAsyncHandlerWrapper,
  fileMetadataBufferKeys,
  hasOwnProperty,
  omitKeys,
} from './utils';
import { ValidatedOperation } from './types';
import { extensionConfiguration } from './config';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: extensionConfiguration.corsAllowList,
    methods: ['GET', 'POST'],
  }),
);

app.use(
  '/process/**',
  expressAsyncHandlerWrapper(async (req, res, next) => {
    const operationsString = req.baseUrl.replace('/process/', '');
    const queryParams = req.query;

    // 404 if no operations
    if (!operationsString || !operationsString.length) {
      return next();
    }

    const validatedOperations: ValidatedOperation[] =
      asValidatedOperations(operationsString);

    // Ensure input is the first operation.
    if (validatedOperations[0].operation != 'input') {
      throw new AssertionError({
        message: `An input operation must be the first operation.`,
      });
    }

    // Ensure output is the last operation.
    if (
      validatedOperations[validatedOperations.length - 1].operation != 'output'
    ) {
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

    if (hasOwnProperty(queryParams, 'debug')) {
      const [metadataError, fileMetadata] = await a2a(instance.metadata());
      if (metadataError) {
        return next(metadataError);
      }
      return res.json({
        operations: validatedOperations,
        metadata: omitKeys(fileMetadata, fileMetadataBufferKeys),
      });
    }

    const [outputError, output] = await a2a(
      instance.toBuffer({ resolveWithObject: true }),
    );
    if (outputError) {
      return next(outputError);
    }

    const { data, info } = output;

    functions.logger.debug(`Processed a new request.`, validatedOperations);

    const headers = {
      'Content-Type': `image/${info.format}`,
      'Content-Length': data.length,
      'Content-Disposition': `inline; filename=image.${info.format}`,
    };

    Object.entries(info).forEach(entry => {
      headers[`ext-output-info-${entry[0].toLowerCase()}`] = `${entry[1]}`;
    });

    // TODO attach headers using final fileMetadata

    res.writeHead(200, headers);
    res.end(data);
  }),
);

// Express requires the function to have 4 arguments for a handler
// to be treated as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (error, req, res, next) {
  if (error instanceof StructError || error instanceof AssertionError) {
    functions.logger.warn(error.message, {
      url: req.url,
      query: req.query,
    });
    res.status(400).send(error.message);
  } else {
    functions.logger.error(
      'An error occurred processing a request, please report this issue to the GitHub ' +
        'repository for this extension and include this log entry with your report (omit any ' +
        'sensitive data).',
      {
        url: req.url,
        query: req.query,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
    );
    res
      .status(500)
      .send('A server error occurred. See server logs for more information.');
  }
});

app.use('*', (_req, res) => {
  res.status(404).send('Not Found');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, 'localhost', () =>
    functions.logger.info(
      `Local dev server listening on http://localhost:3001`,
    ),
  );
} else {
  exports.api = functions.handler.https.onRequest(app);
}
