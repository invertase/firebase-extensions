export default () => {
  /** This doesn't work for storage emulation - needs to be in the test file for file upload */
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
  process.env.GCLOUD_PROJECT = 'demo-test';
};
