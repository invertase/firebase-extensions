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
const name = 'convolve';

/**
 * Convolve the image with the specified kernel.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Width of the kernel in pixels.
   */
  width: utils.coerceStringToInt(
    superstruct.size(superstruct.integer(), 3, 1001),
  ),

  /**
   * Height of the kernel in pixels.
   */
  height: utils.coerceStringToInt(
    superstruct.size(superstruct.integer(), 3, 1001),
  ),

  /**
   * Array of length width*height containing the kernel values.
   */
  kernel: utils.coerceStringToArray(
    superstruct.size(superstruct.array(superstruct.number()), 1, 9999),
  ),

  /**
   * The scale of the kernel in pixels. (optional, default sum)
   */
  scale: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 1)),
  ),

  /**
   * The offset of the kernel in pixels. (optional, default 0)
   */
  offset: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),
});

export type OperationConvolve = superstruct.Infer<typeof struct>;

export const operationConvolve: OperationBuilder = {
  name,
  struct,
};
