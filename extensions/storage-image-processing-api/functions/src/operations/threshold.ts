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
const name = 'threshold';

/**
 * Any pixel value greater than or equal to the threshold value will be set to 255, otherwise it will be set to 0.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * A value in the range 0-255 representing the level at which the threshold will be applied. (optional, default 128)
   */
  threshold: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 255)),
    128,
  ),

  /**
   * Convert to single channel grayscale. (optional, default true)
   */
  grayscale: superstruct.optional(utils.coerceStringToBoolean()),
});

export type OperationThreshold = superstruct.Infer<typeof struct>;

export const operationThreshold: OperationBuilder = {
  name,
  struct,

  build(operation) {
    const options = operation.options as OperationThreshold;

    return [
      {
        method: name,
        arguments: [options.threshold, utils.omitKey(options, 'grayscale')],
      },
    ];
  },
};
