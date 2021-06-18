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
import sharp from 'sharp';
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

import { operationResize } from './resize';
import { operationExtract } from './extract';
import { operationExtend } from './extend';
import { operationBlur } from './blur';
import { operationTrim } from './trim';
import { operationRotate } from './rotate';
import { operationText } from './text';
import { operationComposite } from './composite';

export * from './resize';
export * from './extract';
export * from './extend';
export * from './blur';
export * from './trim';
export * from './rotate';
export * from './text';
export * from './composite';

const builders: { [key: string]: OperationBuilder } = {
  resize: operationResize,
  extract: operationExtract,
  crop: operationExtract, // alias
  extend: operationExtend,
  blur: operationBlur,
  trim: operationTrim,
  rotate: operationRotate,
  text: operationText,
  composite: operationComposite,
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

export function asValidatedOperations(input: string): ValidatedOperation[] {
  const output: ValidatedOperation[] = [];
  const operationSegments = input.split('/');

  for (let i = 0; i < operationSegments.length; i++) {
    const source = operationSegments[i].trim();
    const [operation, ...optionSegments] = source.split(',');

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

export async function asBuiltOperations(
  validatedOperations: ValidatedOperation[],
  fileMetadata: sharp.Metadata,
): Promise<BuiltOperation[]> {
  const output: BuiltOperation[] = [];
  for (let i = 0; i < validatedOperations.length; i++) {
    const validatedOperation = validatedOperations[i];
    const actionBuilder =
      builderForOperation(validatedOperation)?.build || defaultActionsBuilder;
    let builtActions = actionBuilder(validatedOperation, fileMetadata);
    if (builtActions instanceof Promise) {
      builtActions = await builtActions;
    }
    output.push({
      ...validatedOperation,
      actions: builtActions,
    });
  }
  return output;
}

export async function applyBuiltOperation(
  instance: sharp.Sharp,
  operation: BuiltOperation,
): Promise<sharp.Sharp> {
  let currentInstance = instance;
  for (let i = 0; i < operation.actions.length; i++) {
    const action = operation.actions[i];
    currentInstance = (
      currentInstance[action.method] as (...args: unknown[]) => sharp.Sharp
    )(...action.arguments);
    const newBuffer = await currentInstance.toBuffer();
    currentInstance = sharp(newBuffer);
  }
  return currentInstance;
}
