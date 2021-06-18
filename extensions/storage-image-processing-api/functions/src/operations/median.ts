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
const name = 'median';

/**
 * Apply median filter. When used without parameters the default window is 3x3.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Square mask size: size x size.
   * Note larger sizes can significantly reduce the performance of processing image,
   * e.g. a size of 15 on a 500x500 image adds around 1.5s to processing time.
   *
   * Defaults to 3.
   */
  size: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 1, 1000)),
    3,
  ),
});

export type OperationMedian = superstruct.Infer<typeof struct>;

export const operationMedian: OperationBuilder = {
  name,
  struct,
  build(operation) {
    const options = operation.options as OperationMedian;
    return [
      {
        method: name,
        arguments: [options.size],
      },
    ];
  },
};
