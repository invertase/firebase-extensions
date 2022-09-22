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

import { AssertionError } from 'assert';
import sharp, { SharpOptions } from 'sharp';
import superstruct from 'superstruct';

import { omitKey, omitUndefinedValues } from '../utils';
import {
  ActionBuilder,
  BuiltOperation,
  Operation,
  OperationBuilder,
  OperationOptions,
  ValidatedOperation,
} from '../types';

import { operationInput } from './input';
import { operationOutput } from './output';
import { operationResize } from './resize';
import { operationExtract } from './extract';
import { operationExtend } from './extend';
import { operationBlur } from './blur';
import { operationTrim } from './trim';
import { operationRotate } from './rotate';
import { operationText } from './text';
import { operationComposite } from './composite';
import { operationFlip } from './flip';
import { operationFlop } from './flop';
import { operationSharpen } from './sharpen';
import { operationMedian } from './median';
import { operationFlatten } from './flatten';
import { operationGamma } from './gamma';
import { operationNegate } from './negate';
import { operationNormalize } from './normalize';
import { operationAffine } from './affine';
import { operationClahe } from './clahe';
import { operationThreshold } from './threshold';
import { operationConvolve } from './convolve';
import { operationColorspace } from './colorspace';
import { operationRecomb } from './recomb';
import { operationTint } from './tint';
import { operationGrayScale } from './grayscale';
import { operationModulate } from './modulate';
import { operationLinear } from './linear';

export * from './input';
export * from './output';
export * from './resize';
export * from './extract';
export * from './extend';
export * from './blur';
export * from './trim';
export * from './rotate';
export * from './text';
export * from './composite';
export * from './flip';
export * from './flop';
export * from './sharpen';
export * from './median';
export * from './flatten';
export * from './gamma';
export * from './negate';
export * from './normalize';
export * from './affine';
export * from './clahe';
export * from './threshold';
export * from './convolve';
export * from './colorspace';
export * from './recomb';
export * from './tint';
export * from './grayscale';
export * from './modulate';
export * from './linear';

const builders: { [key: string]: OperationBuilder } = {
  input: operationInput,
  output: operationOutput,
  resize: operationResize,
  extract: operationExtract,
  extend: operationExtend,
  blur: operationBlur,
  trim: operationTrim,
  rotate: operationRotate,
  text: operationText,
  composite: operationComposite,
  flip: operationFlip,
  flop: operationFlop,
  sharpen: operationSharpen,
  median: operationMedian,
  flatten: operationFlatten,
  gamma: operationGamma,
  negate: operationNegate,
  normalize: operationNormalize,
  affine: operationAffine,
  clahe: operationClahe,
  threshold: operationThreshold,
  convolve: operationConvolve,
  toColorspace: operationColorspace,
  recomb: operationRecomb,
  tint: operationTint,
  grayscale: operationGrayScale,
  modulate: operationModulate,
  linear: operationLinear,
};

export function builderForOperation(operation: Operation): OperationBuilder {
  const operationName = operation.operation;
  return builders[operationName];
}

export function asValidatedOperationOptions(
  input: Operation,
): OperationOptions {
  const operation = input as Operation;
  const operationName = operation.operation;
  const operationBuilder = builderForOperation(input);

  if (!operationBuilder) {
    throw new AssertionError({
      message: `Operation of type '${operationName}' does not exist or is unsupported.`,
    });
  }

  // Use the custom validator if set.
  if (operationBuilder.validate) {
    const validatedOperation = operationBuilder.validate(input);
    return omitKey(
      omitUndefinedValues<Operation>(validatedOperation),
      'operation',
    );
  }

  // Use the struct for default validation.
  const struct = operationBuilder.struct as superstruct.Struct<Operation>;
  return omitKey(
    omitUndefinedValues<Operation>(struct.create(operation)),
    'operation',
  );
}

export const defaultActionsBuilder: ActionBuilder = (
  operation: ValidatedOperation,
) => {
  return [
    {
      method: operation.operation,
      arguments: [operation.options],
    },
  ];
};

export function jsonAsValidatedOperations(
  operations: Operation[],
): ValidatedOperation[] {
  const output: ValidatedOperation[] = [];

  for (let i = 0; i < operations.length; i++) {
    const rawOptions = operations[i];
    const operation = rawOptions.operation;
    try {
      const options = asValidatedOperationOptions(rawOptions);
      output.push({
        source: '',
        operation,
        rawOptions,
        options,
      });
    } catch (error) {
      error.message = `Options for the '${operation}' operation (at position ${i}) are invalid: ${error.message}`;
      throw error;
    }
  }

  return output;
}

export function asValidatedOperations(input: string): ValidatedOperation[] {
  const output: ValidatedOperation[] = [];
  const operationSegments = input.split('/');

  for (let i = 0; i < operationSegments.length; i++) {
    const source = operationSegments[i].trim();
    const [operation, ...optionSegments] = source.split('~');

    // Parse raw options.
    const rawOptions: Operation = {
      operation: operation,
    };
    for (let j = 0; j < optionSegments.length; j++) {
      const optionSegment = optionSegments[j].trim();
      const [key, value] = optionSegment.split(':');
      if (value == undefined) {
        // An option without a value is treated as a flag.
        rawOptions[key] = 'true';
      } else {
        rawOptions[key] = decodeURIComponent(value);
      }
    }

    // Validate options.
    try {
      const options = asValidatedOperationOptions(rawOptions);
      output.push({
        source,
        operation,
        rawOptions,
        options,
      });
    } catch (error) {
      error.message = `Options for the '${operation}' operation (at position ${i}) are invalid: ${error.message}`;
      throw error;
    }
  }

  return output;
}

export async function asBuiltOperation(
  validatedOperation: ValidatedOperation,
  fileMetadata: sharp.Metadata | null,
): Promise<BuiltOperation> {
  const actionBuilder =
    builderForOperation(validatedOperation)?.build || defaultActionsBuilder;
  let builtActions = actionBuilder(validatedOperation, fileMetadata);
  if (builtActions instanceof Promise) {
    builtActions = await builtActions;
  }
  return {
    ...validatedOperation,
    actions: builtActions,
  };
}

export async function applyValidatedOperation(
  instance: sharp.Sharp | null,
  validatedOperation: ValidatedOperation,
): Promise<sharp.Sharp> {
  let currentInstance = instance;
  const currentMetadata = currentInstance
    ? await currentInstance.metadata()
    : null;
  const builtOperation = await asBuiltOperation(
    validatedOperation,
    currentMetadata,
  );
  for (let i = 0; i < builtOperation.actions.length; i++) {
    const action = builtOperation.actions[i];
    if (action.method == 'constructor') {
      currentInstance = sharp(...(action.arguments as SharpOptions[]));
    } else if (currentInstance != null) {
      currentInstance = (
        currentInstance[action.method] as (...args: unknown[]) => sharp.Sharp
      )(...action.arguments);
      const newBuffer = await currentInstance.toBuffer();
      currentInstance = sharp(newBuffer);
    }
  }
  return currentInstance as sharp.Sharp;
}
