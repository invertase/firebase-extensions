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
const name = 'grayscale';

/**
 * Convert to 8-bit grayscale; 256 shades of grey.
 * This is a linear operation.
 * If the input image is in a non-linear colour space such as sRGB,
 * use gamma() with grayscale() for the best results.
 * By default the output image will be web-friendly sRGB and contain
 * three (identical) color channels.
 * This may be overridden by other sharp operations such as toColourspace('b-w'),
 * which will produce an output image containing one color channel.
 * An alpha channel may be present, and will be unchanged by the operation.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Convert to grayscale, true or false value. Defaults to true.
   */
  grayscale: superstruct.defaulted(utils.coerceStringToBoolean(), true),
});

export type OperationGrayScale = superstruct.Infer<typeof struct>;

export const operationGrayScale: OperationBuilder = {
  name,
  struct,
  build(operation) {
    const options = operation.options as OperationGrayScale;
    return [
      {
        method: name,
        arguments: [options.grayscale],
      },
    ];
  },
};
