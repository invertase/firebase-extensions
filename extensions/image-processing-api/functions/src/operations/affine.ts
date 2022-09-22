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

import * as sharp from 'sharp';
import * as superstruct from 'superstruct';
import * as utils from '../utils';
import { OperationBuilder } from '../types';

/**
 * The user visible name of this operation.
 */
const name = 'affine';

/**
 * Perform an affine transform on an image.
 * You must provide a matrix array of length 4 affine transformation matrix.
 *
 * By default, new pixels are filled with a black background. You can provide a
 * background color with the background option.
 *
 * A particular interpolator may also be specified via the interpolator option.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Affine transformation matrix.
   * You must provide a array of length 4 affine transformation matrix,
   * e.g., `[1,0.3,0.1,0.7]`
   *
   * Must be a single array of 4 numbers.
   */
  matrix: utils.coerceStringToArray(
    superstruct.size(superstruct.array(superstruct.number()), 4, 4),
  ),

  /**
   * Background color to fill new pixels with.
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   * Defaults to black without transparency.
   */
  background: superstruct.optional(superstruct.string()),

  /**
   * Input horizontal offset.
   */
  idx: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Input vertical offset.
   */
  idy: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Output horizontal offset.
   */
  odx: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Output vertical offset.
   */
  ody: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Interpolator to use, defaults to `bicubic`
   */
  interpolator: superstruct.optional(
    superstruct.enums([
      /**
       * [Nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation).
       * Suitable for image enlargement only.
       */
      'nearest',

      /**
       * [Bilinear interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation).
       * Faster than bicubic but with less smooth results.
       */
      'bilinear',

      /**
       * [Bicubic interpolation](http://en.wikipedia.org/wiki/Bicubic_interpolation)
       * (the default).
       */
      'bicubic',

      /**
       * [LBB interpolation](https://github.com/jcupitt/libvips/blob/master/libvips/resample/lbb.cpp#L100).
       * Prevents some "[acutance](http://en.wikipedia.org/wiki/Acutance)" but typically reduces performance
       * by a factor of 2.
       */
      'locallyBoundedBicubic',

      /**
       * [Nohalo interpolation](http://eprints.soton.ac.uk/268086/).
       * Prevents acutance but typically reduces performance by a factor of 3.
       */
      'nohalo',

      /**
       * [Vertex Split Quadratic Basis Spline interpolation](https://github.com/jcupitt/libvips/blob/master/libvips/resample/vsqbs.cpp#L48).
       * Prevents "staircasing" when enlarging.
       */
      'vertexSplitQuadraticBasisSpline',
    ]),
  ),
});

export type OperationAffine = superstruct.Infer<typeof struct>;

export const operationAffine: OperationBuilder = {
  name,
  struct,

  build(operation) {
    const options = operation.options as OperationAffine;
    if (options.interpolator) {
      // @ts-ignore, types are invalid - this does actually exist.
      options.interpolator = sharp.default.interpolators[options.interpolator];
    }
    return [
      {
        method: name,
        arguments: [options.matrix, utils.omitKey(options, 'matrix')],
      },
    ];
  },
};
