import axios from 'axios';
import firebase from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
process.env.GCLOUD_PROJECT = 'demo-test';

const app = firebase.initializeApp({
  projectId: 'demo-test',
  storageBucket: 'demo-test.appspot.com',
});

const apiEndpointUrl =
  'http://localhost:5001/demo-test/europe-west2/ext-storage-image-processing-api-handler/process';

const remoteImgUrl =
  'https://images.unsplash.com/photo-1512546321483-c0468b7b8a95';

const buildUrl = (operations: string) =>
  `${apiEndpointUrl}?operations=${operations}`;

describe('operations testing', () => {
  describe('when no options are provided', () => {
    test('should return a default created image', async () => {
      const url = buildUrl('');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('input', () => {
    test('should create a new default image when a type of create is provided.', async () => {
      const url = buildUrl('input:type_create/output:format_png');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('should create a new default image when a type of url is provided with a https source', async () => {
      const url = buildUrl(
        'input:type_url/output:format_png/https://images.pexels.com/photos/4203280/pexels-photo-4203280.jpeg',
      );
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('should create a new default image when a type of url is provided with a http source', async () => {
      const url = buildUrl(
        'input:type_url/output:format_png/http://images.pexels.com/photos/4203280/pexels-photo-4203280.jpeg',
      );
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('should create a new default image when a type of gcs is provided with a gs source', async () => {
      const url = buildUrl(
        `input:type_gcs,source_invertase.jpeg/output:format_png`,
      );
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('output', () => {
    test('should create a new image with output provided', async () => {
      const url = buildUrl('output:format_png');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('convolve', () => {
    test('should create a new image with a convolve operation provided', async () => {
      const url = buildUrl('convolve:height_3,width_3,kernel_-101-202-101');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('should create a new image with a convolve utility provided', async () => {
      const url = buildUrl('co:h_3,w_3,k_-101-202-101');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });
});

test('should create a new image with a h utility provided', async () => {
  const url = buildUrl('h:10');
  const { status } = await axios.get(url);

  expect(status).toBe(200);
});

test('should create a new image with a w utility provided', async () => {
  const url = buildUrl('w:10');
  const { status } = await axios.get(url);

  expect(status).toBe(200);
});

test('should create a new image with a h and w utility provided', async () => {
  const url = buildUrl('h:10/w:50');
  const { status } = await axios.get(url);

  expect(status).toBe(200);
});

test('should create a new image with a custom background colour', async () => {
  const url = buildUrl('h:10/w:50/flatten:bg_red');
  const { status } = await axios.get(url);

  expect(status).toBe(200);
});
