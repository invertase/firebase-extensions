import {
  OperationAffine,
  OperationBlur,
  OperationClahe,
  OperationColorspace,
  OperationComposite,
  OperationConvolve,
  OperationExtend,
  OperationExtract,
  OperationFlatten,
  OperationGamma,
  OperationInput,
  OperationInputCreateNew,
  OperationLinear,
  OperationMedian,
  OperationModulate,
  OperationOutput,
  OperationOutputAvif,
  OperationOutputJpeg,
  OperationOutputPng,
  OperationOutputTiff,
  OperationOutputWebp,
  OperationRecomb,
  OperationResize,
  OperationRotate,
  OperationSharpen,
  OperationText,
  OperationThreshold,
  OperationTint,
  OperationTrim,
} from './types/operations';

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type InputOptions = DistributiveOmit<OperationInput, 'operation'>;
export type OutputOptions =
  | { jpeg: Omit<OperationOutputJpeg, 'operation' | 'format'> }
  | { avif: Omit<OperationOutputAvif, 'operation' | 'format'> }
  | { png: Omit<OperationOutputPng, 'operation' | 'format'> }
  | { tiff: Omit<OperationOutputTiff, 'operation' | 'format'> }
  | { webp: Omit<OperationOutputWebp, 'operation' | 'format'> };

export type AffineOptions = Omit<OperationAffine, 'operation'>;
export type BlurOptions = Omit<OperationBlur, 'operation'>;
export type ColorspaceOptions = Omit<OperationColorspace, 'operation'>;
export type ClaheOptions = Omit<OperationClahe, 'operation'>;
export type CompositeOptions = Omit<OperationComposite, 'operation'>;
export type ConvolveOptions = Omit<OperationConvolve, 'operation'>;
export type ExtendOptions = Omit<OperationExtend, 'operation'>;
export type ExtractOptions = Omit<OperationExtract, 'operation'>;
export type FlattenOptions = Omit<OperationFlatten, 'operation'>;
export type GammaOptions = Omit<OperationGamma, 'operation'>;
export type LinearOptions = Omit<OperationLinear, 'operation'>;
export type MedianOptions = Omit<OperationMedian, 'operation'>;
export type ModulateOptions = Omit<OperationModulate, 'operation'>;
export type RecombOptions = Omit<OperationRecomb, 'operation'>;
export type ResizeOptions = Omit<OperationResize, 'operation'>;
export type RotateOptions = Omit<OperationRotate, 'operation'>;
export type SharpenOptions = Omit<OperationSharpen, 'operation'>;
export type TextOptions = Omit<OperationText, 'operation'>;
export type ThresholdOptions = Omit<OperationThreshold, 'operation'>;
export type TintOptions = Omit<OperationTint, 'operation'>;
export type TrimOptions = Omit<OperationTrim, 'operation'>;

type OperationType =
  | 'affine'
  | 'blur'
  | 'clahe'
  | 'colorspace'
  | 'composite'
  | 'convolve'
  | 'extend'
  | 'extract'
  | 'flatten'
  | 'flip'
  | 'flop'
  | 'gamma'
  | 'grayscale'
  | 'linear'
  | 'median'
  | 'modulate'
  | 'negate'
  | 'normalize'
  | 'recomb'
  | 'resize'
  | 'rotate'
  | 'sharpen'
  | 'text'
  | 'threshold'
  | 'tint'
  | 'trim';

// A list of all available operation types.
type Operations = Array<
  (
    | AffineOptions
    | BlurOptions
    | ClaheOptions
    | ColorspaceOptions
    | CompositeOptions
    | ConvolveOptions
    | ExtendOptions
    | ExtractOptions
    | FlattenOptions
    | GammaOptions
    | LinearOptions
    | MedianOptions
    | ModulateOptions
    | RecombOptions
    | ResizeOptions
    | RotateOptions
    | SharpenOptions
    | TextOptions
    | ThresholdOptions
    | TintOptions
    | TrimOptions
  ) & {
    operation: OperationType;
  }
>;

class ImageProcessingApi {
  #input: OperationInput | undefined = undefined;
  #output: OperationOutput | undefined = undefined;
  #operations: Operations = [];

  public input(options: InputOptions) {
    if ('source' in options) {
      this.#input = {
        operation: 'input',
        type: 'gcs',
        source: options.source,
      };
    } else if ('url' in options) {
      this.#input = {
        operation: 'input',
        type: 'url',
        url: options.url,
      };
    } else {
      this.#input = {
        operation: 'input',
        type: 'create',
      } as OperationInputCreateNew;
    }

    return this;
  }

  public output(options: OutputOptions) {
    if ('jpeg' in options) {
      this.#output = {
        operation: 'output',
        format: 'jpeg',
        ...options.jpeg,
      };
    } else if ('webp' in options) {
      this.#output = {
        operation: 'output',
        format: 'webp',
        ...options.webp,
      };
    } else if ('tiff' in options) {
      this.#output = {
        operation: 'output',
        format: 'tiff',
        ...options.tiff,
      };
    } else if ('avif' in options) {
      this.#output = {
        operation: 'output',
        format: 'avif',
        ...options.avif,
      };
    } else if ('png' in options) {
      this.#output = {
        operation: 'output',
        format: 'png',
        ...options.png,
      };
    }

    return this;
  }

  public affine(options: AffineOptions) {
    this.#operations.push({
      operation: 'affine',
      ...options,
    });

    return this;
  }

  public blur(options: BlurOptions) {
    this.#operations.push({
      operation: 'blur',
      ...options,
    });

    return this;
  }

  public clahe(options: ClaheOptions) {
    this.#operations.push({
      operation: 'clahe',
      ...options,
    });

    return this;
  }

  public colorspace(options: ColorspaceOptions) {
    this.#operations.push({
      operation: 'colorspace',
      ...options,
    });

    return this;
  }

  public composite(options: CompositeOptions) {
    this.#operations.push({
      operation: 'composite',
      ...options,
    });

    return this;
  }

  public convolve(options: ConvolveOptions) {
    this.#operations.push({
      operation: 'convolve',
      ...options,
    });

    return this;
  }

  public extend(options: ExtendOptions) {
    this.#operations.push({
      operation: 'extend',
      ...options,
    });

    return this;
  }

  public extract(options: ExtractOptions) {
    this.#operations.push({
      operation: 'extract',
      ...options,
    });

    return this;
  }

  public flatten(options: FlattenOptions) {
    this.#operations.push({
      operation: 'flatten',
      ...options,
    });

    return this;
  }

  public flip() {
    this.#operations.push({
      operation: 'flip',
    });

    return this;
  }

  public flop() {
    this.#operations.push({
      operation: 'flop',
    });

    return this;
  }

  public gamma(options: GammaOptions) {
    this.#operations.push({
      operation: 'gamma',
      ...options,
    });

    return this;
  }

  public grayscale() {
    this.#operations.push({
      operation: 'grayscale',
      grayscale: true,
    });

    return this;
  }

  public linear(options: LinearOptions) {
    this.#operations.push({
      operation: 'linear',
      ...options,
    });

    return this;
  }

  public median(options: MedianOptions) {
    this.#operations.push({
      operation: 'median',
      ...options,
    });

    return this;
  }

  public modulate(options: ModulateOptions) {
    this.#operations.push({
      operation: 'modulate',
      ...options,
    });

    return this;
  }

  public negate() {
    this.#operations.push({
      operation: 'negate',
    });

    return this;
  }

  public recomb(options: RecombOptions) {
    this.#operations.push({
      operation: 'recomb',
      ...options,
    });

    return this;
  }

  public resize(options: ResizeOptions) {
    this.#operations.push({
      operation: 'resize',
      ...options,
    });

    return this;
  }

  public rotate(options: RotateOptions) {
    this.#operations.push({
      operation: 'rotate',
      ...options,
    });

    return this;
  }

  public sharpen(options: SharpenOptions) {
    this.#operations.push({
      operation: 'sharpen',
      ...options,
    });

    return this;
  }

  public text(options: TextOptions) {
    this.#operations.push({
      operation: 'text',
      ...options,
    });

    return this;
  }

  public threshold(options: ThresholdOptions) {
    this.#operations.push({
      operation: 'threshold',
      ...options,
    });

    return this;
  }

  public tint(options: TintOptions) {
    this.#operations.push({
      operation: 'tint',
      ...options,
    });

    return this;
  }

  public trim(options: TrimOptions) {
    this.#operations.push({
      operation: 'trim',
      ...options,
    });

    return this;
  }

  public toJSON() {
    if (!this.#input) {
      throw new Error('An input operation is required.');
    }

    if (!this.#output) {
      throw new Error('An output operation is required.');
    }

    return [this.#input, ...this.#operations, this.#output];
  }

  public toString() {
    return JSON.stringify(this.toJSON());
  }

  public toEncodedString() {
    return encodeURIComponent(this.toString());
  }
}

/**
 * Returns a new instance of the ImageProcessingApi.
 *
 * Example:
 *
 * ```js
 * const operations = builder()
 *  .input({
 *    source: 'https://example.com/image.jpg',
 *  })
 *  .flip()
 *  .grayscale()
 *  .rotate({ angle: 90 })
 *  .output({
 *    format: 'png',
 *  })
 *  .toJSON();
 * ```
 *
 * @returns {ImageProcessingApi}
 */
export function builder(): ImageProcessingApi {
  return new ImageProcessingApi();
}
