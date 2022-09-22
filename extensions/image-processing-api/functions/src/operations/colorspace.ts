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
const name = 'colorspace';

/**
 * Set the output colorspace. By default output image will
 * be web-friendly sRGB, with additional channels interpreted
 * as alpha channels.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),

  /**
   * Output colourspace e.g. srgb, rgb, cmyk, lab, b-w ...
   */
  colorspace: superstruct.enums([
    'cmyk',
    'labq',
    'rgb',
    'cmc',
    'labs',
    'srgb',
    'fourier',
    'rgb16',
    'grey16',
    'matrix',
    'scrgb',
    'hsv',
  ]),
});

export type OperationColorspace = superstruct.Infer<typeof struct>;

export const operationColorspace: OperationBuilder = {
  name,
  struct,

  build(operation) {
    const options = operation.options as OperationColorspace;

    return [
      {
        method: name,
        arguments: [options.colorspace],
      },
    ];
  },
};
