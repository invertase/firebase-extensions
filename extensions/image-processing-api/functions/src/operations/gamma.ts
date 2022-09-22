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
const name = 'gamma';

/**
 * Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of 1/gamma then
 * increasing the encoding (brighten) post-resize at a factor of gamma.
 * This can improve the perceived brightness of a resized image in non-linear colour spaces.
 * JPEG and WebP input images will not take advantage of the shrink-on-load performance optimization
 * when applying a gamma correction.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * A value between 1.0 and 3.0.
   */
  gamma: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 1.0, 3.0)),
    1.0,
  ),

  /**
   * A value between 1.0 and 3.0.
   * If not set then defaults to the same as`gamma`.
   */
  gammaOut: superstruct.optional(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 1.0, 3.0)),
  ),
});

export type OperationGamma = superstruct.Infer<typeof struct>;

export const operationGamma: OperationBuilder = {
  name,
  struct,
  build(operation) {
    const options = operation.options as OperationGamma;
    return [
      {
        method: name,
        arguments: [options.gamma, options.gammaOut],
      },
    ];
  },
};
