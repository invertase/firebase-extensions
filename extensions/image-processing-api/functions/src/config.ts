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

export const extensionConfiguration = {
  bucket: process.env.CLOUD_STORAGE_BUCKET,
  corsAllowList: (process.env.CORS_ORIGIN_ALLOW_LIST || '*')
    .split(',')
    .map(s => s.trim()),
  hostname: process.env.HOSTNAME || null,
  googleApiKey: process.env.GOOGLE_API_KEY || null,
  geminiPrompt: process.env.GEMINI_PROMPT || null,
};
