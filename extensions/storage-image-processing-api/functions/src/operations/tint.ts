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
 * Tint the image using the provided chroma while preserving the image luminance.
 * An alpha channel if present will be unchanged by the operation.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Color string which chroma values are extracted from.
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   */
  rgb: superstruct.string(),
});

export type OperationTint = superstruct.Infer<typeof struct>;

export const operationTint: OperationBuilder = {
  name,
  struct,
  build(operation) {
    const options = operation.options as OperationTint;
    return [
      {
        method: name,
        arguments: [options.rgb],
      },
    ];
  },
};
