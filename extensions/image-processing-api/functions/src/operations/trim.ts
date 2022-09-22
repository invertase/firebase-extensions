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
const name = 'trim';

/**
 * Trim "boring" pixels from all edges that contain values similar to the top-left pixel.
 * Images consisting entirely of a single colour will calculate "boring" using the alpha channel, if any.
 *
 * The `ext-output-info-trimoffsetleft` and `ext-output-info-trimoffsettop` http headers
 * returned from the process api endpoint contain the trimmed offset information.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * The allowed difference from the top-left pixel, a number greater than zero.
   */
  threshold: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),
});

export type OperationTrim = superstruct.Infer<typeof struct>;

export const operationTrim: OperationBuilder = {
  name,
  struct,

  /**
   * Custom action builder since Sharp does not accept an object of options
   * for trim.
   */
  build(operation) {
    const options = operation.options as OperationTrim;
    return [
      {
        method: name,
        arguments: options.threshold != undefined ? [options.threshold] : [],
      },
    ];
  },
};
