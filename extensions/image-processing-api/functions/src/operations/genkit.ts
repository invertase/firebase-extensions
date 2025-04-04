/*
 * Copyright (c) 2016-present Invertase Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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

import sharp from 'sharp';
import superstruct from 'superstruct';
import { OperationBuilder, ValidatedOperation } from '../types';

const name = 'genkit';

const struct = superstruct.object({
  operation: superstruct.literal(name),
  prompt: superstruct.string(), // require a prompt string
});

export const operationGenkit: OperationBuilder = {
  name,
  struct,
  async build(
    operation: ValidatedOperation,
    fileMetadata: sharp.Metadata | null,
  ) {
    const options = operation.options as { prompt: string };
    // Return a custom action with the prompt parameter.
    return [
      {
        method: 'genkitCall',
        arguments: [options.prompt],
      },
    ];
  },
};

// TODO: Genkit implementation
export const callGenkit: (any) => Promise<any> = async (x: any) => x;
