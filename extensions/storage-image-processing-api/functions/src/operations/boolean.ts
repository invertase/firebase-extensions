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
const name = 'boolean';

/**
 * Any pixel value greater than or equal to the threshold value will be set to 255, otherwise it will be set to 0.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Buffer containing image data or string containing the path to an image file.
   */
  operand: superstruct.string(),

  /**
   * One of and, or or eor to perform that bitwise operation, like the C logic operators &, | and ^ respectively.
   */
  operator: superstruct.string(),

  /**
   * One of and, or or eor to perform that bitwise operation, like the C logic operators &, | and ^ respectively.
   */
  raw: superstruct.optional(
    superstruct.size(superstruct.array(superstruct.number()), 3, 3),
  ),
});

export type OperationThreshold = superstruct.Infer<typeof struct>;

export const operationThreshold: OperationBuilder = {
  name,
  struct,

  build(operation) {
    const options = operation.options as OperationThreshold;

    const getRawOptions = () => {
      const [width, height, channels] = options.raw;
      return { raw: { width, height, channels } };
    };

    const optionsWithRaw = options.raw ? [{ ...getRawOptions() }] : [];

    return [
      {
        method: name,
        arguments: [
          options.operation,
          options.operand,
          options.operator,
          [...optionsWithRaw],
        ],
      },
    ];
  },
};
