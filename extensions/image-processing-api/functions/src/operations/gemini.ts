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

import * as superstruct from 'superstruct';
import { OperationBuilder } from '../types';
import { genkit } from 'genkit';
import { googleAI, gemini20FlashExp } from '@genkit-ai/googleai';
import { extensionConfiguration } from '../config';

const name = 'gemini';

const struct = superstruct.object({
  operation: superstruct.literal(name),
});

export const operationGemini: OperationBuilder = {
  name,
  struct,
  async build() {
    return [
      {
        method: 'gemini',
        arguments: [],
      },
    ];
  },
};

interface CallGeminiOptions {
  imageBuffer: Buffer;
  prompt: string;
}

export const callGemini: (
  options: CallGeminiOptions,
) => Promise<Buffer> = async options => {
  const ai = genkit({
    plugins: [
      googleAI({
        apiKey: extensionConfiguration.googleApiKey || '',
      }),
    ],
  });

  const base64 = options.imageBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  content: [
    { text: options.prompt },
    { media: { url: dataUrl, contentType: 'image/png' } },
  ];

  console.warn('calling gemini', options);

  // @ts-ignore
  const response = await ai.generate({
    // @ts-ignore
    model: gemini20FlashExp,
    messages: [
      {
        role: 'user',
        content: [
          {
            text: options.prompt,
          },
          { media: { url: dataUrl, contentType: 'image/png' } },
        ],
      },
    ],
    config: {
      version: 'gemini-2.0-flash-exp-image-generation',
      responseModalities: ['image', 'text'],
    },
  });

  console.warn('gemini response', response);
  console.warn('gemini response');

  // @ts-ignore
  const dataUrlResponse = response.message?.content[0].media?.url;

  if (!dataUrlResponse) {
    throw new Error('No image returned from the AI.');
  }
  // Decode the base64 image and save it
  const base64Data = dataUrlResponse.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  return buffer;
};
