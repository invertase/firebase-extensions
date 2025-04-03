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
import sharp from 'sharp';
import express from 'express';

export type ActionBuilder = (
  validatedOperation: ValidatedOperation,
  imageMetadata: sharp.Metadata | null,
  req?: express.Request,
) => OperationAction[] | Promise<OperationAction[]>;

export type OperationBuilder = {
  name: string;

  /**
   * The superstruct definition for this operation
   */
  struct: superstruct.Struct;

  /**
   * Optionally provide a custom validator.
   */
  validate?: (rawOptions: Operation) => Operation;

  /**
   * Override usage of the defaultActionBuilder.
   */
  build?: ActionBuilder;
};

export interface Operation {
  operation: string;
  [key: string]: unknown;
}

export type OperationOptions = Omit<Operation, 'operation'>;

export interface ValidatedOperation extends Operation {
  source: string;
  rawOptions: Operation;
  options: OperationOptions;
}

export interface BuiltOperation extends ValidatedOperation {
  actions: OperationAction[];
}

export interface OperationAction {
  /**
   * The method name on the Sharp instance that will be called. This is required for non
   * input operations.
   */
  method: string;
  arguments: unknown[];
}

/**
 * Custom error class for operation related errors.
 */
export class OperationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'OperationError';
    this.statusCode = statusCode;
  }
}

/**
 * NotFoundError extends OperationError with a default status code of 404.
 */
export class NotFoundError extends OperationError {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}
