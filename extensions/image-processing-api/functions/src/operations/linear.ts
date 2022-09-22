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
const name = 'linear';

/**
 * Apply the linear formula a * input + b to the image (levels adjustment)
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Multiplier (optional, default 1.0)
   */
  a: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.min(superstruct.number(), 0.0)),
    1.0,
  ),

  /**
   * Offset (optional, default 0.0)
   */
  b: superstruct.defaulted(
    utils.coerceStringToFloat(superstruct.min(superstruct.number(), 0.0)),
    0.0,
  ),
});

export type OperationLinear = superstruct.Infer<typeof struct>;

export const operationLinear: OperationBuilder = {
  name,
  struct,

  build(operation) {
    const options = operation.options as OperationLinear;

    return [
      {
        method: name,
        arguments: [options.a, options.b],
      },
    ];
  },
};
