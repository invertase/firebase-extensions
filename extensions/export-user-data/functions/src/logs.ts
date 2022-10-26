/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { logger } from 'firebase-functions';
import config from './config';

export const completeExport = (uid: string): void => {
  logger.log(`Successfully exported data for user: ${uid}`);
};

export const firestoreExported = (): void => {
  logger.log('Finished Exporting user data from Cloud Firestore');
};

export const firestoreExporting = (): void => {
  logger.log('Exporting user data from Cloud Firestore');
};

export const firestoreConfigPathsNotConfigured = (): void => {
  logger.log('Cloud Firestore paths are not configured, skipping');
};

export const customHookNotConfigured = (): void => {
  logger.log('paths from a custom hook are not configured, skipping');
};

export const firestorePathExported = (path: string): void => {
  logger.log(`Exported: '${path}' from Cloud Firestore`);
};

export const storagePathExported = (path: string): void => {
  logger.log(`Exported: '${path}' from Cloud Storage`);
};

export const firestorePathExporting = (path: string): void => {
  logger.log(`Exporting: '${path}' from Cloud Firestore`);
};

export const exportError = (err: Error, path?: string): void => {
  if (path) {
    logger.error(`Error exporting: '${path}'`, err);
  } else {
    logger.error('Error exporting', err);
  }
};

export const firestorePathNotString = (): void => {
  logger.error(
    'Firestore paths must be strings, skipping. Check your custom hook response.',
  );
};

export const rtdbPathNotString = (): void => {
  logger.error(
    'Database paths must be strings, skipping. Check your custom hook response.',
  );
};

export const storagePathNotString = (): void => {
  logger.error(
    'Storage paths must be strings, skipping. Check your custom hook response.',
  );
};

export const init = (): void => {
  logger.log('Initializing extension with configuration', config);
};

export const rtdbPathExported = (path: string): void => {
  logger.log(`Exported: '${path}' from the Realtime Database`);
};

export const rtdbConfigPathsNotConfigured = (): void => {
  logger.log('Realtime Database paths are not configured, skipping');
};

export const rtdbPathExporting = (path: string): void => {
  logger.log(`Exporting: '${path}' from the Realtime Database`);
};

export const rtdbPathError = (path: string, err: Error): void => {
  logger.error(
    `Error when Exporting: '${path}' from the Realtime Database`,
    err,
  );
};

export const startExport = (uid: string): void => {
  logger.log(
    `Started extension execution with configuration for ${uid}`,
    config,
  );
};

export const storagePath404 = (path: string): void => {
  logger.log(`File: '${path}' does not exist in Cloud Storage, skipping`);
};

export const storagePathError = (path: string, err: Error): void => {
  logger.error(`Error Exporting: '${path}' from Cloud Storage`, err);
};

export const StoragePathExporting = (path: string): void => {
  logger.log(`Exporting: '${path}' from Cloud Storage`);
};

export const StoragePathExported = (path: string): void => {
  logger.log(`Exported: '${path}' from Cloud Storage`);
};

export const customHookBadResponse = (endpoint: string): void => {
  logger.error(
    `Custom hook endpoint ${endpoint} did not return a 200 response`,
  );
};

export const customHookInvalidData = (endpoint: string): void => {
  logger.error(
    `Custom hook endpoint ${endpoint} did not return JSON in the valid format`,
  );
};

export const rtdbLocationNotConfigured = (): void => {
  logger.log(
    'Realtime Database paths are provided but no database location is configured, skipping Realtime Database exports',
  );
};

export const storageConfigPathsNotConfigured = (): void => {
  logger.log('Cloud Storage paths are not configured, skipping');
};

export const genericLog = (message: string): void => {
  logger.log(message);
};
