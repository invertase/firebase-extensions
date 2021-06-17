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
import { omitKey } from '../utils';

/**
 * The user visible name of this operation.
 */
const name = 'rotate';

/**
 * Rotate the output image by either an explicit angle or auto-orient based on the EXIF Orientation tag.
 * If an angle is provided, it is converted to a valid positive degree rotation. For example, -450 will
 * produce a 270deg rotation.
 * When rotating by an angle other than a multiple of 90, the background colour can be provided with the
 * background option. If no angle is provided, it is determined from the EXIF data.
 * Mirroring is supported and may infer the use of a flip operation.
 * The use of rotate implies the removal of the EXIF Orientation tag, if any.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Angle of rotation.
   */
  angle: superstruct.optional(utils.coerceStringToInt(superstruct.integer())),

  /**
   * When rotating by an angle other than a multiple of 90, this background colour can be provided..
   * See the [color npm library](https://www.npmjs.com/package/color) for supported string formats.
   * Defaults to black without transparency.
   */
  background: superstruct.optional(superstruct.string()),
});

export type OperationRotate = superstruct.Infer<typeof struct>;

export const operationRotate: OperationBuilder = {
  name,
  struct,

  /**
   * Custom action builder since Sharp separates `angle` from the options object.
   */
  build(operation) {
    const options = operation.options as OperationRotate;
    const optionsWithoutAngle = omitKey(options, 'angle');
    return [
      {
        method: name,
        arguments:
          options.angle != undefined
            ? [options.angle, optionsWithoutAngle]
            : [null, optionsWithoutAngle],
      },
    ];
  },
};
