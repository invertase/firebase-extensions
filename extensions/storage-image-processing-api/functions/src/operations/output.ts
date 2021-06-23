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
import { Operation, OperationBuilder } from '../types';

/**
 * The user visible name of this operation.
 */
const name = 'output';

/**
 * Output to png.
 */
const structPng = superstruct.object({
  operation: superstruct.literal(name),
  format: superstruct.literal('png'),
  /**
   * Use progressive (interlace) scan.
   */
  progressive: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Zlib compression level, 0 (fastest, largest) to 9 (slowest, smallest) (optional, default 6)
   */
  compressionLevel: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 9)),
  ),

  /**
   * Use adaptive row filtering (optional, default false)
   */
  adaptiveFiltering: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Quantise to a palette-based image with alpha transparency support (optional, default false)
   */
  palette: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Use the lowest number of colours needed to achieve given quality, sets palette to true (optional, default 100)
   */
  quality: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 100)),
  ),

  /**
   * Maximum number of palette entries, sets palette to true (optional, default 256)
   */
  colours: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 2, 256)),
  ),

  /**
   * Alternative spelling of options.colours, sets palette to true (optional, default 256)
   */
  colors: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 2, 256)),
  ),

  /**
   * Level of Floyd-Steinberg error diffusion, sets palette to true (optional, default 1.0)
   */
  dither: superstruct.optional(
    utils.coerceStringToFloat(superstruct.size(superstruct.number(), 0.0, 1.0)),
  ),

  /**
   * Force PNG output, otherwise attempt to use input format (optional, default true)
   */
  force: superstruct.optional(utils.coerceStringToBoolean()),
});

/**
 * Output to jpeg.
 */
const structJpeg = superstruct.object({
  operation: superstruct.literal(name),
  format: superstruct.literal('jpeg'),

  /**
   * quality, integer 1-100 (optional, default 80)
   */
  quality: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 1, 100)),
  ),

  /**
   * Use progressive (interlace) scan (optional, default false)
   */
  progressive: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Set to '4:4:4' to prevent chroma subsampling otherwise defaults to '4:2:0' chroma subsampling (optional, default '4:2:0')
   */
  chromaSubsampling: superstruct.optional(superstruct.string()),

  /**
   * Optimise Huffman coding tables (optional, default true)
   */
  optimiseCoding: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Alternative spelling of optimiseCoding (optional, default true)
   */
  optimizeCoding: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Use mozjpeg defaults, equivalent to { trellisQuantisation: true, overshootDeringing: true, optimiseScans: true, quantisationTable: 3 } (optional, default false)
   */
  mozjpeg: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Apply trellis quantisation (optional, default false)
   */
  trellisQuantisation: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Apply overshoot deringing (optional, default false)
   */
  overshootDeringing: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Optimise progressive scans, forces progressive (optional, default false)
   */
  optimiseScans: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Alternative spelling of optimiseScans (optional, default false)
   */
  optimizeScans: superstruct.optional(utils.coerceStringToBoolean()),

  /**
   * Quantization table to use, integer 0-8 (optional, default 0)
   */
  quantisationTable: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 8)),
  ),

  /**
   * Alternative spelling of quantisationTable (optional, default 0)
   */
  quantizationTable: superstruct.optional(
    utils.coerceStringToInt(superstruct.size(superstruct.integer(), 0, 8)),
  ),

  /**
   * Force JPEG output, otherwise attempt to use input format (optional, default true)
   */
  force: superstruct.optional(utils.coerceStringToBoolean()),
});

/**
 * Output to webp.
 */
const structWebp = superstruct.object({
  operation: superstruct.literal(name),
  format: superstruct.literal('webp'),
  // TODO options
});

/**
 * Output to tiff.
 */
const structTiff = superstruct.object({
  operation: superstruct.literal(name),
  format: superstruct.literal('tiff'),
  // TODO options
});

/**
 * Output to avif.
 */
const structAvif = superstruct.object({
  operation: superstruct.literal(name),
  format: superstruct.literal('avif'),
  // TODO options
});

/**
 * An operation that defines image output format and options.
 */
const struct = superstruct.union([
  structPng,
  structJpeg,
  structWebp,
  structTiff,
  structAvif,
]);

export type OperationOutput = superstruct.Infer<typeof struct>;

export const operationOutput: OperationBuilder = {
  name,
  struct,
  validate(rawOptions: Operation): Operation {
    switch (rawOptions.format) {
      case 'jpeg':
        return structJpeg.create(rawOptions);
      case 'webp':
        return structWebp.create(rawOptions);
      case 'tiff':
        return structTiff.create(rawOptions);
      case 'avif':
        return structAvif.create(rawOptions);
      case 'png':
      default:
        return structPng.create({ ...rawOptions, format: 'png' });
    }
  },
  async build(operation) {
    const options = operation.options as OperationOutput;

    return [
      {
        method: options.format,
        arguments: [utils.omitKey(options, 'format')],
      },
    ];
  },
};
