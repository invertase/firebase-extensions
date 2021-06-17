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

/**
 * The user visible name of this operation.
 */
const name = 'extend';

/**
 * Extends/pads the edges of the image with the provided background colour.
 * This operation will always occur after resizing and extraction, if any.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Pixel count to extend by from the top.
   * Defaults to 0.
   */
  all: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Pixel count to extend by from the top.
   * Defaults to 0.
   */
  top: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Pixel count to extend by from the left.
   * Defaults to 0.
   */
  left: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Pixel count to extend by from the bottom.
   * Defaults to 0.
   */
  bottom: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Pixel count to extend by from the right.
   * Defaults to 0.
   */
  right: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Background color as a string to extend with.
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   * Defaults to black without transparency.
   */
  background: superstruct.optional(superstruct.string()),
});

export type OperationExtend = superstruct.Infer<typeof struct>;

export const operationExtend: OperationBuilder = {
  name,
  struct,

  /**
   * Custom action builder to support `all` flag.
   */
  build(operation) {
    const optionsCopy = Object.assign({}, operation.options) as OperationExtend;

    if (optionsCopy.all) {
      optionsCopy.top = optionsCopy.all;
      optionsCopy.left = optionsCopy.all;
      optionsCopy.bottom = optionsCopy.all;
      optionsCopy.right = optionsCopy.all;
      delete optionsCopy.all;
    }

    return [
      {
        method: name,
        arguments: [optionsCopy],
      },
    ];
  },
};
