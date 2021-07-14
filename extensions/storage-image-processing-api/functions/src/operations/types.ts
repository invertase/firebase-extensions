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

export const imageGravity = [
  'center',
  'centre',
  'north',
  'east',
  'south',
  'west',
  'northeast',
  'southeast',
  'southwest',
  'northwest',
] as const;
export type ImageGravity = typeof imageGravity;

/**
 * More information about blend modes can be found
 * at https://libvips.github.io/libvips/API/current/libvips-conversion.html#VipsBlendMode
 * and https://www.cairographics.org/operators/
 */
export const imageBlend = [
  'clear',
  'source',
  'over',
  'in',
  'out',
  'atop',
  'dest',
  'dest-over',
  'dest-in',
  'dest-out',
  'dest-atop',
  'xor',
  'add',
  'saturate',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'colour-dodge',
  'color-dodge',
  'colour-burn',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
] as const;
export type ImageBlend = typeof imageGravity;
