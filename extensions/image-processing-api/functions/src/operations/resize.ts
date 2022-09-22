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
import { imageGravity } from './types';
import { OperationBuilder } from '../types';

/**
 * The user visible name of this operation.
 */
const name = 'resize';

/**
 * How the image should be resized to fit both provided dimensions.
 */
export const operationResizeFit = [
  /**
   * Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit.
   */
  'cover',

  /**
   * Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
   */
  'contain',

  /**
   * Ignore the aspect ratio of the input and stretch to both provided dimensions.
   */
  'fill',

  /**
   * Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than
   * or equal to both those specified.
   */
  'inside',

  /**
   * Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater
   * than or equal to both those specified.
   */
  'outside',
] as const;
export type OperationResizeFit = typeof operationResizeFit;

/**
 * Position to apply when resizing and using a contain/cover fit.
 */
export const operationResizePosition = [
  'top',
  'right',
  'bottom',
  'left',
  'right top',
  'right bottom',
  'left bottom',
  'left top',
] as const;
export type OperationResizePosition = typeof operationResizePosition;

/**
 * The kernel to use for image reduction.
 */
export const operationResizeKernel = [
  'nearest',
  'cubic',
  'mitchell',
  'lanczos2',
  'lanczos3',
] as const;
export type OperationResizeKernel = typeof operationResizeKernel;

/**
 * Strategy to use for automatic cover behaviour when resizing.
 */
export const operationResizeStrategy = [
  /**
   * Focus on the region with the highest [Shannon entropy](https://en.wikipedia.org/wiki/Entropy_%28information_theory%29) .
   */
  'entropy',

  /**
   * Focus on the region with the highest luminance frequency, colour saturation and presence of skin tones.
   */
  'attention',
] as const;
export type OperationResizeStrategy = typeof operationResizeStrategy;

/**
 * Resize image to width, height or width x height.
 * When both a width and height are provided, the possible methods by which the image should fit these are:
 *  cover: (default) Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),
  /**
   * Number of pixels wide the resultant image should be.
   * If you don't provide a value the width will auto-scale to match the height.
   */
  width: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * Number of pixels high the resultant image should be.
   * If you don't provide a value the height will auto-scale to match the width.
   */
  height: superstruct.optional(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
  ),

  /**
   * How the image should be resized to fit both provided dimensions.
   * Defaults to 'cover'.
   */
  fit: superstruct.optional(superstruct.enums(operationResizeFit)),

  /**
   * How the image should be positioned as a position, gravity or strategy string.
   *
   * This property is used when `fit` is set to `cover` or `contain`.
   *
   * Examples:
   *  - `right top`
   *  - `left bottom`
   *  - `centre`
   *  - `north`
   *  - `southwest`
   *  - `entropy`
   *
   * Defaults to `center`.
   */
  position: superstruct.optional(
    superstruct.enums([
      ...operationResizePosition,
      ...imageGravity,
      ...operationResizeStrategy,
    ]),
  ),

  /**
   * Background color as a string to use when using `fit` or `contain` resize modes.
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   * Defaults to black without transparency.
   */
  background: superstruct.optional(superstruct.string()),

  /**
   * The kernel to use for image reduction.
   * Defaults to `lanczos3`.
   */
  kernel: superstruct.optional(superstruct.enums(operationResizeKernel)),

  /**
   * Do not enlarge if the width or height are already less than the specified dimensions.
   * Defaults to `false`.
   */
  withoutEnlargement: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Take greater advantage of the JPEG and WebP shrink-on-load feature,
   * which can lead to a slight moiré pattern on some images.
   * Defaults to true.
   */
  fastShrinkOnLoad: superstruct.optional(utils.coerceStringToBoolean()),
});

export type OperationResize = superstruct.Infer<typeof struct>;

export const operationResize: OperationBuilder = {
  name,
  struct,
};
