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
const name = 'clahe';

/**
 * Perform contrast limiting adaptive histogram equalization ([CLAHE](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization#Contrast_Limited_AHE))
 * This will, in general, enhance the clarity of the image by bringing out darker details.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Integer width of the region in pixels.
   */
  width: utils.coerceStringToInt(superstruct.min(superstruct.integer(), 1)),

  /**
   * Integer height of the region in pixels.
   */
  height: utils.coerceStringToInt(superstruct.min(superstruct.integer(), 1)),

  /**
   * Maximum value for the slope of the cumulative histogram.
   * A value of 0 disables contrast limiting.
   * (optional, default 3)
   */
  maxSlope: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 100)),
  ),
});

export type OperationClahe = superstruct.Infer<typeof struct>;

export const operationClahe: OperationBuilder = {
  name,
  struct,
};
