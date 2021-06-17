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
const name = 'blur';

/**
 * Blur the image. When used without options, performs a fast, mild blur of the output image.
 * When a sigma is provided, performs a slower, more accurate Gaussian blur.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * A value between 0.3 and 1000 representing the sigma of the Gaussian mask,
   * where sigma = 1 + radius / 2.
   */
  sigma: superstruct.optional(
    utils.coerceStringToFloat(
      superstruct.size(superstruct.number(), 0.3, 1000),
    ),
  ),
});

export type OperationBlur = superstruct.Infer<typeof struct>;

export const operationBlur: OperationBuilder = {
  name,
  struct,

  /**
   * Custom action builder since Sharp does not accept an object of options
   * for blur.
   */
  build(operation) {
    const options = operation.options as OperationBlur;
    return [
      {
        method: name,
        arguments: options.sigma ? [options.sigma] : [],
      },
    ];
  },
};
