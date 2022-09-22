import * as superstruct from 'superstruct';
import { Blend, Colorspace, Gravity, Interpolator, OperationResizeFit, OperationResizeKernel, OperationResizePosition, OperationResizeStrategy, TextAlign } from "./enums";
import { operationBlur } from '../../functions/src/operations/blur';
export type InputOptions = {
  source: string;
} | {
  url: string;
};

export type OutputOptions = {
  jpeg: OutputJpegOptions;
} | {
  webp: OutputWebpOptions;
} | {
  tiff: OutputTiffOptions;
} | {
  avif: OutputAvifOptions;
} | {
  png: OutputPngOptions;
}

export type OutputJpegOptions = {
  progress?: boolean;
  compressionLevel?: number;
  // TODO check type
  adaptiveFiltering?: boolean;
  palette?: boolean;
  quality?: number;
  colours?: number;
  colors?: number;
  dither?: number;
  force?: boolean;
}

export type OutputWebpOptions = {
  quality?: number;
  alphaQuality?: number;
  lossless?: boolean;
  nearLossless?: boolean;
  smartSubsample?: boolean;
  reductionEffort?: number;
  pageHeight?: number;
  force?: boolean;
}

export type OutputTiffOptions = {
  quality?: number;
  force?: number;
  // TODO fix
  compression?: any;
  // TODO fix
  predictor?: any;
  pyramid?: boolean;
  tile?: boolean;
  tileWidth?: number;
  tileHeight?: number;
  xres?: number;
  yres?: number;
  bitdepth?: number;
}

export type OutputAvifOptions = {
  quality?: number;
  lossless?: boolean;
  speed?: number;
  chromaSubsampling?: string;
}

export type OutputPngOptions = {
  progressive?: boolean;
  compressionLevel?: number;
  adaptiveFiltering?: boolean;
  palette?: boolean;
  quality?: number;
  colours?: number;
  colors?: number;
  dither?: number;
  force?: boolean;
}

export type AffineOptions = {
  matrix: Array<number>;
  idx?: number;
  idy?: number;
  odx?: number;
  ody?: number;
  interpolator?: Interpolator;
}

// export type BlurOptions = {
//   sigma: number;
// }

export type BlurOptions = superstruct.Infer<typeof operationBlur.struct>;

export type ColorspaceOptions = {
  width: Colorspace;
}

export type ClaheOptions = {
  width: number;
  height: number;
  maxSlope?: number;
}

export type CompositeOptions = {
  input: string;
  blend: Blend;
  premultiplied: string;
  density: number;
  gravity?: Gravity;
  top?: number;
  left?: number;
  tile?: Boolean;
}

export type ConvolveOptions = {
  width: number;
  height: number;
  kernel: Array<-1|-2|-3|-4|-5|-6|-7|-8|-9|1|2|3|4|5|6|7|8|9>;
  scale?: number;
  offet?: string;
}

export type ExtendOptions = {
  all?: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  // TODO check if optional
  background?: string;
}

export type ExtractOptions = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export type FlattenOptions = {
  background?: string;
}

// TODO confirm if string or number
export type GammaOptions = {
  gamma?: number;
  gammaOut?: number;
}

export type LinearOptions = {
  a?: number;
  b?: number;
}

export type MedianOptions = {
  size?: number;
}

// TODO Check if these are optional or not
// TODO Check if this is all options
export type ModulateOptions = {
  brightness?: number;
  saturation?: number;
  hue?: number;
}

export type RecombOptions = {
  matrix: Array<Array<number>>;
}

export type ResizeOptions = {
  operationResizeFit: OperationResizeFit;
  operationResizePosition: OperationResizePosition;
  operationResizeKernel: OperationResizeKernel;
  operationResizeStrategy: OperationResizeStrategy;
}

export type RotateOptions = {
  angle: number;
}

export type SharpenOptions = {
  // TODO check if this is optional
  sigma?: number;
  flat?: number;
  jagged?: number;
}

export type TextOptions = {
  font?: string;
  textAlign?: TextAlign;
  textColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
  padding?: number;
  borderWidth?: number;
  borderColor?: string;
  wrap?: boolean;
  maxWidth?: number;
  blend?: Blend;
  gravity?: Gravity;
  top?: number;
  left?: number;
}

export type ThresholdOptions = {
  threshold?: number;
  // TODO Should this be here?
  grayscale?: boolean;
}

export type TintOptions = {
  rgb: string;
}

export type TrimOptions = {
  // TODO
}

type OperationType = 'affine' | 'blur' | 'clahe' | 'colorspace' | 'composite' | 'convolve' | 'extend' | 'extract' | 'flatten' | 'flip' | 'flop' | 'gamma' | 'grayscale' | 'linear' | 'median' | 'modulate' | 'negate' | 'recomb' | 'resize' | 'rotate' | 'sharpen' | 'text' | 'threshold' | 'tint' | 'trim';

type InputOperation = {
  operation: 'input';
} & ({
  type: 'gcs';
  source: string;
} | {
  type: 'url';
  url: string;
} | {
  type: 'create';
});

type OutputOperation = {
  operation: 'output';
} & (
  ({
    format: 'jpeg';
  } & OutputJpegOptions) | ({
    format: 'webp';
  } & OutputWebpOptions) | ({
    format: 'tiff';
  } & OutputTiffOptions) | ({
    format: 'avif';
  } & OutputAvifOptions) | ({
    format: 'png';
  } & OutputPngOptions)
);

// A list of all available operation types.
type Operations = Array<( AffineOptions | BlurOptions | ClaheOptions | ColorspaceOptions | CompositeOptions | ConvolveOptions | ExtendOptions | ExtractOptions | FlattenOptions | GammaOptions | LinearOptions | MedianOptions | ModulateOptions | RecombOptions | ResizeOptions | RotateOptions | SharpenOptions | TextOptions | ThresholdOptions | TintOptions | TrimOptions) & {
  operation: OperationType;
}>;

class StorageImageProcessingApi {
  #input: InputOperation | undefined = undefined;
  #output: OutputOperation | undefined = undefined;
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
      };
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
    
    return [
      this.#input,
      ...this.#operations,
      this.#output,
    ];
  }

  public toString() {
    return JSON.stringify(this.toJSON());
  }

  public toEncodedString() {
    return encodeURIComponent(this.toString());
  }
}

/**
 * Returns a new instance of the StorageImageProcessingApi.
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
 * @returns {StorageImageProcessingApi}
 */
export function builder(): StorageImageProcessingApi {
  return new StorageImageProcessingApi();
}

