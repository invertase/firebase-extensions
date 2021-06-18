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
const name = 'sharpen';

/**
 * Sharpen the image. When used without parameters, performs a fast, mild sharpen of the output image.
 * When a sigma is provided, performs a slower, more accurate sharpen of the L channel in the LAB colour space.
 * Separate control over the level of sharpening in "flat" and "jagged" areas is available.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * A value between 0.01 and 1000 representing the sigma of the Gaussian mask,
   * where sigma = 1 + radius / 2.
   */
  sigma: superstruct.optional(
    utils.coerceStringToFloat(
      superstruct.size(superstruct.number(), 0.01, 1000),
    ),
  ),

  /**
   * The level of sharpening to apply to "flat" areas.
   * Defaults to 1.0.
   */
  flat: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 0, 10000)),
    1.0,
  ),

  /**
   * The level of sharpening to apply to "jagged" areas.
   * Defaults to 2.0.
   */
  jagged: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 0, 10000)),
    2.0,
  ),
});

export type OperationSharpen = superstruct.Infer<typeof struct>;

export const operationSharpen: OperationBuilder = {
  name,
  struct,
  build(operation) {
    const options = operation.options as OperationSharpen;
    return [
      {
        method: name,
        arguments: [options.sigma, options.flat, options.jagged],
      },
    ];
  },
};
