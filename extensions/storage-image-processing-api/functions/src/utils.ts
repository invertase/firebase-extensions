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

import * as superstruct from 'superstruct';
import * as axios from 'axios';
import * as fileType from 'file-type';

import express from 'express';
import a2a from 'a2a';
import { AssertionError } from 'assert';

/**
 * Keys in sharp file metadata that contain buffers. Used for
 * excluding from logging.
 */
export const fileMetadataBufferKeys = ['xmp', 'iptc', 'exif', 'icc'];

export function coerceStringToInt<T>(
  struct: superstruct.Struct<T>,
): superstruct.Struct<T> {
  return superstruct.coerce(struct, superstruct.string(), value => {
    // Keys without values are converted to 'true' to function as flags.
    // Return the 'true' value instead of trying to parseInt so that
    // validation error output is more helpful.
    if (value == 'true') return value;
    return parseInt(value, 10);
  });
}

export function coerceStringToFloat<T>(
  struct: superstruct.Struct<T>,
): superstruct.Struct<T> {
  return superstruct.coerce(struct, superstruct.string(), value => {
    // Keys without values are converted to 'true' to function as flags.
    // Return the 'true' value instead of trying to parseInt so that
    // validation error output is more helpful.
    if (value == 'true') return value;
    return parseFloat(value);
  });
}

export function coerceStringToBoolean(): superstruct.Struct<boolean, null> {
  return superstruct.coerce(
    superstruct.boolean(),
    superstruct.string(),
    value => {
      if (value === 'false') return false;
      if (value === '0') return false;
      if (value === 'true') return true;
      if (value === '1') return false;
      // Return the original value if unable to parse.
      // This will cause boolean validation to fail (correctly).
      return value;
    },
  );
}

export function coerceStringToArray<T>(
  struct: superstruct.Struct<T>,
): superstruct.Struct<T> {
  return superstruct.coerce(struct, superstruct.string(), value => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  });
}

export function coerceStringToNumericArray<T>(
  struct: superstruct.Struct<T>,
): superstruct.Struct<T> {
  return superstruct.coerce(struct, superstruct.string(), value => {
    try {
      return [...value.match(/-?\d/g).map($ => parseInt($))];
    } catch {
      return null;
    }
  });
}

export function omitUndefinedValues<T>(object: T): T {
  Object.keys(object).forEach(key =>
    object[key] === undefined ? delete object[key] : {},
  );
  return object;
}

export function omitKeys<T>(object: T, keys: string[]): T {
  const output = Object.assign({}, object);
  for (let i = 0; i < keys.length; i++) {
    delete output[keys[i]];
  }
  return output;
}

export function omitKey<T>(object: T, key: string): T {
  return omitKeys<T>(object, [key]);
}

export function hasOwnProperty(target: unknown, property: string): boolean {
  return Object.hasOwnProperty.call(target, property);
}

export function expressAsyncHandlerWrapper(
  handler: express.RequestHandler,
): express.RequestHandler {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export async function isImageFileType(buffer: Buffer): Promise<boolean> {
  const type = await fileType.fromBuffer(buffer);
  if (!type) return false;
  return type.mime.startsWith('image/');
}

export async function fetchImageBufferFromUrl(url: string): Promise<Buffer> {
  const [possibleError, possibleResponse] = await a2a(
    axios.default.get(url, {
      responseType: 'arraybuffer',
    }),
  );
  let response: axios.AxiosResponse = possibleResponse;
  if (possibleError) {
    response = possibleError.response;
  }

  if (response.data && response.status == 200) {
    const isImage = await isImageFileType(response.data);
    if (!isImage) {
      throw new AssertionError({
        message: `The file returned from url "${url}" does not seem to be a valid image type.`,
      });
    }

    return response.data;
  }

  const errorMessage = `Unable to fetch image from url "${url}", the url returned a non-successful status code of "${response.status}".`;
  throw new AssertionError({
    message: `${errorMessage} The returned error was: ${possibleError.message}`,
  });
}
