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
const name = 'flop';

/**
 * Flop the image about the horizontal X axis.
 */
const struct = superstruct.object({
  operation: superstruct.literal(name),
});

export type OperationFlop = superstruct.Infer<typeof struct>;

export const operationFlop: OperationBuilder = {
  name,
  struct,

  /**
   * No arguments action builder.
   */
  build() {
    return [
      {
        method: name,
        arguments: [],
      },
    ];
  },
};
