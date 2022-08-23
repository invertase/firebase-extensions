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
import cors from 'cors';
import express from 'express';
import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import helmet from 'helmet';
import { StructError } from 'superstruct';

import { asValidatedOperations, jsonAsValidatedOperations } from './operations';
import { expressAsyncHandlerWrapper } from './utils';
import { Operation, ValidatedOperation } from './types';
import { extensionConfiguration } from './config';
import { JSONParser } from './parsers/jsonParser';
import { HTMLParser } from './parsers/htmlParser';
import { processImageRequest } from './processImageRequest';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: extensionConfiguration.corsAllowList,
    methods: ['GET', 'POST', 'HEAD'],
  }),
);

app.get(
  '/process',
  expressAsyncHandlerWrapper(async (req, res, next) => {
    let operationsString = req.query.operations as string;

    let operations: Operation[];

    /** Check QueryString type */
    try {
      JSON.parse(operationsString);

      /** Run JSON based operations */
      operations = JSONParser(operationsString, next);
    } catch (e) {
      /** Run HTML based operations */
      operations = HTMLParser(operationsString, next);
    }

    const validatedOperations: ValidatedOperation[] =
      jsonAsValidatedOperations(operations);

    const [processError] = await a2a(
      processImageRequest(validatedOperations, res),
    );
    if (processError) {
      return next(processError);
    }
  }),
);

app.get(
  '/process/**',
  expressAsyncHandlerWrapper(async (req, res, next) => {
    const operationsString = req.url.replace('/process/', '');
    if (!operationsString || !operationsString.length) {
      return next();
    }

    const validatedOperations: ValidatedOperation[] =
      asValidatedOperations(operationsString);
    const [processError] = await a2a(
      processImageRequest(validatedOperations, res),
    );
    if (processError) {
      return next(processError);
    }
  }),
);

// Express requires the function to have 4 arguments for a handler
// to be treated as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function handleError(error, req, res, next) {
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

app.use('*', function notFoundHandler(_req, res) {
  res.status(404).send('Not Found');
});

if (process.env.EXPRESS_SERVER === 'true') {
  app.listen(3001, 'localhost', () =>
    functions.logger.info(
      `Local dev server listening on http://localhost:3001`,
    ),
  );
} else {
  firebase.initializeApp();
  exports.handler = functions.handler.https.onRequest(app);
}
