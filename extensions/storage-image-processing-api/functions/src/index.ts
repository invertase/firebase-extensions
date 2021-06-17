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

import path from 'path';
import { readFileSync } from 'fs';
import { AssertionError } from 'assert';

import a2a from 'a2a';
import * as sharp from 'sharp';
import {
  applyBuiltOperation,
  asBuiltOperations,
  asValidatedOperations,
} from './operations';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as functions from 'firebase-functions';
import { StructError } from 'superstruct';
import { expressAsyncHandlerWrapper, hasOwnProperty } from './utils';
import { ValidatedOperation } from './types';

const app = express();

// TODO make extension configuration

app.use(helmet());
app.use(
  cors({
    // TODO cors options from extension configuration
    origin: '*',
  }),
);

app.use(
  '/process/**',
  expressAsyncHandlerWrapper(async (req, res, next) => {
    const operationsString = req.params[0];
    const queryParams = req.query;

    // 404 if no operations
    if (!operationsString || !operationsString.length) {
      return next();
    }

    const validatedOperations: ValidatedOperation[] =
      asValidatedOperations(operationsString);

    // TODO this won't work for full https storage urls, extract the file name
    // TODO from the http url
    const fileName = path.basename(queryParams.input as string);

    // TODO replace this and actually get file from GCP storage (queryParams.input);
    const fileInputBuffer = readFileSync(
      `${process.cwd()}${queryParams.input}`,
    );

    const [metadataError, fileMetadata] = await a2a(
      sharp.default(fileInputBuffer).metadata(),
    );
    if (metadataError) {
      return next(metadataError);
    }
    const builtOperations = asBuiltOperations(
      validatedOperations,
      fileMetadata,
    );

    if (hasOwnProperty(queryParams, 'debug')) {
      return res.json(builtOperations);
    }

    // Apply operations.
    let instance = sharp.default(fileInputBuffer);
    for (let i = 0; i < builtOperations.length; i++) {
      const builtOperation = builtOperations[i];
      instance = await applyBuiltOperation(instance, builtOperation);
    }

    // TODO output option handling, e.g. png, quality etc

    const [outputError, output] = await a2a(
      instance.toBuffer({ resolveWithObject: true }),
    );
    if (outputError) {
      return next(outputError);
    }

    const { data, info } = output;

    functions.logger.debug(
      `Processed a request for image '${fileName}'.`,
      builtOperations,
    );

    const headers = {
      'Content-Type': `image/${info.format}`,
      'Content-Length': data.length,
      'Content-Disposition': `inline; filename=${fileName}`,
    };

    Object.entries(info).forEach(entry => {
      headers[`ext-output-info-${entry[0].toLowerCase()}`] = `${entry[1]}`;
    });

    // TODO attach headers using fileMetadata

    res.writeHead(200, headers);
    res.end(data);
  }),
);

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
