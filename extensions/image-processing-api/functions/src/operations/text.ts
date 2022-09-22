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

// TODO `text-svg` untyped, consider forking and rewriting to TS since library is abandoned
import textToSvg from 'text-svg';
import * as superstruct from 'superstruct';
import * as utils from '../utils';
import { OperationBuilder } from '../types';
import { imageBlend, imageGravity } from './types';
import { AssertionError } from 'assert';

/**
 * The user visible name of this operation.
 */
const name = 'text';

/**
 * Add text onto an image, e.g. as a watermark.
 */
// TODO 1) separate Sharp vs SVG options and combine via superstruct.assign()
// TODO 2) bad `*Color` inputs can cause a server error (vs a 'bad request'), consider adding
// TODO    https://www.npmjs.com/package/color and using it as a custom superstruct validator for colors
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * A string of text that will be rendered over your image.
   */
  value: superstruct.string(),

  /**
   * A string representing the font size and family to use when rendering this text.
   * e.g. `30px sans-serif`.
   *
   * Note only a few common fonts like `sans-serif` and `arial` are supported.
   */
  font: superstruct.defaulted(superstruct.string(), '30px sans-serif'),

  /**
   * Text alignment of the rendered text, e.g. 'left'.
   */
  // TODO bad code in `text-svg` which introduced wrapping support broke text alignment
  textAlign: superstruct.optional(
    superstruct.enums(['left', 'center', 'right']),
  ),

  /**
   * Color of the rendered text.
   */
  textColor: superstruct.defaulted(superstruct.string(), 'white'),

  /**
   * Text stroke color - as a CSS color string.
   */
  backgroundColor: superstruct.optional(superstruct.string()),

  /**
   * Outline/stroke width around the text.
   */
  strokeWidth: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
    0,
  ),

  /**
   * Text stroke color - as a CSS color string.
   */
  strokeColor: superstruct.defaulted(superstruct.string(), 'white'),

  /**
   * Padding in pixels to apply all around the text.
   */
  padding: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
    0,
  ),

  /**
   * Width of the border to apply, or 0 (default) for no border.
   */
  borderWidth: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
    0,
  ),

  /**
   * Border color - as a CSS color string.
   */
  borderColor: superstruct.defaulted(superstruct.string(), 'black'),

  /**
   * Should text be wrapped. Use with `maxWidth` to control line length wrapping.
   */
  // TODO bad code in `text-svg` actually prevents us from turning wrapping off
  wrap: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Max line width before text should be wrapped.
   * Wrapping only occurs if `wrap` is set to true.
   */
  maxWidth: superstruct.defaulted(
    utils.coerceStringToInt(superstruct.min(superstruct.integer(), 0)),
    50,
  ),

  /**
   * How to blend this image with the image.
   * Defaults to 'over'.
   */
  blend: superstruct.defaulted(superstruct.enums([...imageBlend]), 'over'),

  /**
   * Gravity at which to place the overlay. (optional, default 'centre').
   */
  gravity: superstruct.optional(superstruct.enums([...imageGravity])),

  /**
   * Zero-indexed offset in pixels from the top edge.
   */
  top: superstruct.optional(utils.coerceStringToInt(superstruct.integer())),

  /**
   * Zero-indexed offset in pixels from the left edge.
   */
  left: superstruct.optional(utils.coerceStringToInt(superstruct.integer())),
});

export type OperationText = superstruct.Infer<typeof struct>;

export const operationText: OperationBuilder = {
  name,
  struct,

  /**
   * Custom builder since we use `composite` to overlay text as an svg.
   */
  build(operation) {
    const options = operation.options as OperationText;
    const textSvg = textToSvg(options.value, {
      ...options,
    });

    if (options.left && options.top == undefined) {
      throw new AssertionError({
        message: `Options for the '${operation.operation}' operation are invalid: if 'left' is specified then 'top' must also be provided.`,
      });
    }

    if (options.top && options.left == undefined) {
      throw new AssertionError({
        message: `Options for the '${operation.operation}' operation are invalid: if 'top' is specified then 'left' must also be provided.`,
      });
    }

    return [
      {
        method: 'composite',
        arguments: [
          [
            {
              input: Buffer.from(textSvg),
              ...options,
            },
          ],
        ],
      },
    ];
  },
};
