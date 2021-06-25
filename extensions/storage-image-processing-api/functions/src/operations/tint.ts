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
import { OperationBuilder } from '../types';

/**
 * The user visible name of this operation.
 */
const name = 'tint';

/**
 * Tint the image using the provided chroma while preserving the image luminance. An alpha channel may be present and will be unchanged by the operation.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Red colour to be parsed
   */
  r: superstruct.string(),

  /**
   * Blue colour to be parsed
   */
  b: superstruct.string(),

  /**
   * Green colour to be parsed
   */
  g: superstruct.string(),
});

export type OperationTint = superstruct.Infer<typeof struct>;

export const operationTint: OperationBuilder = {
  name,
  struct,

  /**
   * Custom action builder since Sharp does not accept an object of options
   * for trim.
   */
  build(operation) {
    const options = operation.options as OperationTint;

    console.log('Option >>>', options);

    const rgbOption = { ...options };

    return [
      {
        method: name,
        arguments: [rgbOption],
      },
    ];
  },
};
