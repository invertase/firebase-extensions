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
import * as utils from '../utils';
import { Operation, OperationAction, OperationBuilder } from '../types';
import { AssertionError } from 'assert';
import { fetchImageBufferFromUrl } from '../utils';
import { extensionConfiguration } from '../config';

/**
 * The user visible name of this operation.
 */
const name = 'input';

/**
 * a) use a path to a file in a GCS bucket as an input. This file
 * must be publicly readable for this to work.
 * b) use a GCS download url as an input. e.g., from `getDownloadUrl` on the Firebase
 * client SDKS. This URL must be to a file in the same storage bucket as defined in options.
 */
const structFromGcs = superstruct.object({
  operation: superstruct.literal(name),
  type: superstruct.literal('gcs'),
  source: superstruct.string(),
});

/**
 * A web url of an image.
 */
const structFromUrl = superstruct.object({
  operation: superstruct.literal(name),
  type: superstruct.literal('url'),
  url: superstruct.string(),
});

/**
 * Create a new image.
 */
const structCreateNewImage = superstruct.object({
  operation: superstruct.literal(name),
  type: superstruct.literal('create'),

  /**
   * Integer width of new image.
   */
  width: utils.coerceStringToInt(superstruct.min(superstruct.integer(), 1)),

  /**
   * Integer height of the new image.
   */
  height: utils.coerceStringToInt(superstruct.min(superstruct.integer(), 1)),

  /**
   * Background color to fill new pixels with.
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   * Defaults to black without transparency.
   */
  background: superstruct.optional(superstruct.string()),

  /**
   * Integral number of channels, either 3 (RGB) or 4 (RGBA).
   * Defaults to 4 (RGBA).
   */
  channels: superstruct.defaulted(superstruct.enums([3, 4]), 4),

  /**
   * Mean of pixels in generated noise
   */
  noiseMean: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
    0,
  ),

  /**
   * A value between 0 and 1000 representing the sigma of the Gaussian mask,
   * where sigma = 1 + radius / 2.
   */
  noiseSigma: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 0, 1000)),
    0,
  ),

  /**
   * Image format to be created.
   */
  format: superstruct.defaulted(
    superstruct.enums(['png', 'jpeg', 'webp', 'tiff', 'avif']),
    'png',
  ),
});

/**
 * An operation that defines specifying an input image that all future operations will be applied to.
 */
const struct = superstruct.union([
  structFromGcs,
  structFromUrl,
  structCreateNewImage,
]);

export type OperationInput = superstruct.Infer<typeof struct>;

export const operationInput: OperationBuilder = {
  name,
  struct,
  validate(rawOptions: Operation): Operation {
    switch (rawOptions.type) {
      case 'create':
        return structCreateNewImage.create(rawOptions);
      case 'gcs':
        return structFromGcs.create(rawOptions);
      case 'url':
        return structFromUrl.create(rawOptions);
    }
    throw new AssertionError({
      message: `'${rawOptions.type}' is not a valid input 'type'.`,
    });
  },
  async build(operation) {
    const options = operation.options as OperationInput;

    switch (options.type) {
      case 'create':
        return newImageOptions(options);
      case 'gcs':
        return await fetchGcsFile(options);
      case 'url':
        return await fetchUrl(options);
    }
  },
};

async function fetchUrl(options: OperationInput): Promise<OperationAction[]> {
  if (options.type !== 'url') return;
  if (!options.url.startsWith('http')) {
    throw new AssertionError({
      message: `'${options.url}' does not appear to be a valid http url.`,
    });
  }
  return [
    {
      method: 'constructor',
      arguments: [await fetchImageBufferFromUrl(options.url)],
    },
  ];
}

async function fetchGcsFile(
  options: OperationInput,
): Promise<OperationAction[]> {
  if (options.type !== 'gcs') return;
  if (options.source.startsWith('https')) {
    if (
      // default bucket
      !options.source.startsWith(
        `https://firebasestorage.googleapis.com/v0/b/${extensionConfiguration.bucket}.appspot.com/o`,
      ) &&
      // secondary buckets
      !options.source.startsWith(
        `https://firebasestorage.googleapis.com/v0/b/${extensionConfiguration.bucket}/o`,
      )
    ) {
      throw new AssertionError({
        message: `Input 'source' does not appear to be a valid storage download url or is not specifically for the bucket '${extensionConfiguration.bucket}'`,
      });
    }
    return fetchUrl({ ...options, url: options.source, type: 'url' });
  }

  if (!options.source.startsWith('/')) {
    // bad
  }

  // TODO validations if PATH:
  //  - check file is public
  //  - fetch meta and check is image

  return [
    {
      method: 'constructor',
      arguments: [Buffer.from('')],
    },
  ];
}

function newImageOptions(options: OperationInput): OperationAction[] {
  if (options.type !== 'create') return;
  const create: Record<string, unknown | Record<string, unknown>> = {};

  create.width = options.width;
  create.height = options.height;

  if (options.channels) {
    create.channels = options.channels;
  }

  if (options.background) {
    create.background = options.background;
  }

  create.noise = {
    type: 'gaussian',
  };
  if (options.noiseMean != undefined) {
    create.noise['mean'] = options.noiseMean;
  }
  if (options.noiseSigma != undefined) {
    create.noise['sigma'] = options.noiseSigma;
  }

  return [
    {
      method: 'constructor',
      arguments: [
        {
          create,
        },
      ],
    },
    {
      method: options.format,
      arguments: [],
    },
  ];
}
