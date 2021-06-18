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
import { OperationBuilder } from '../types';
import { imageBlend, imageGravity } from './types';
import { readFileSync } from 'fs';
import { AssertionError } from 'assert';

/**
 * The user visible name of this operation.
 */
const name = 'composite';

/**
 * Composite an image over the base image. The image to composite must be the same size
 * or smaller than the base image.
 * If both `top` and `left` options are provided, they take precedence over `gravity`.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * HTTP URL or GCS bucket path (to a public file) of the file you wish to overlay.
   */
  input: superstruct.string(),

  /**
   * How to blend the overlay image with the base image.
   * Defaults to 'over'.
   */
  blend: superstruct.defaulted(superstruct.enums([...imageBlend]), 'over'),

  /**
   * Gravity at which to place the overlay image. (optional, default 'centre').
   */
  gravity: superstruct.optional(superstruct.enums([...imageGravity])),

  /**
   * Zero-indexed offset in pixels from the top edge.
   */
  top: superstruct.optional(utils.coerceStringToInt(superstruct.integer())),

  /**
   * Zero-indexed offset in pixels from the left edge.
   */
  left: superstruct.optional(utils.coerceStringToInt(superstruct.integer())),

  /**
   * If true, repeat the overlay image across the entire image with the given gravity.
   */
  tile: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Set to true to avoid pre-multiplying the image below.
   */
  premultiplied: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Number representing the DPI for vector overlay image. (optional, default 72)
   */
  density: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.integer()),
    72,
  ),
});

export type OperationComposite = superstruct.Infer<typeof struct>;

export const operationComposite: OperationBuilder = {
  name,
  struct,

  /**
   * Custom builder since we use `composite` to overlay text as an svg.
   */
  async build(operation) {
    const options = operation.options as OperationComposite;

    // TODO replace this and actually get file from GCP storage
    const overlayFileBuffer = readFileSync(`${process.cwd()}${options.input}`);

    if (options.left && options.top == undefined) {
      throw new AssertionError({
        message: `Options for the '${operation.operation}' operation are invalid: if 'left' is specified then 'top' must also be provided.`,
      });
    }

    if (options.top && options.left == undefined) {
      throw new AssertionError({
        message: `Options for the '${operation.operation}' operation are invalid: if 'top' is specified then 'left' must also be provided.`,
      });
    }

    return [
      {
        method: 'composite',
        arguments: [
          [
            {
              ...options,
              input: Buffer.from(overlayFileBuffer),
            },
          ],
        ],
      },
    ];
  },
};
