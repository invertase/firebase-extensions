import axios from 'axios';

const apiEndpointUrl =
  'http://localhost:5001/demo-test/europe-west2/ext-storage-image-processing-api-handler/process';

const remoteImgUrl =
  'https://images.unsplash.com/photo-1512546321483-c0468b7b8a95';

const buildUrl = (operations: string) =>
  `${apiEndpointUrl}?operations=${operations}`;

describe('operations testing', () => {
  xtest('successfully creates a new image with no options provided', async () => {
    const url = buildUrl('h_10');
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test('successfully creates a new image with a h utility provided', async () => {
    const url = buildUrl('h_10');
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test('successfully creates a new image with a w utility provided', async () => {
    const url = buildUrl('w_10');
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test('successfully creates a new image with a h and w utility provided', async () => {
    const url = buildUrl('h_10,w_50');
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test.only('successfully creates a new image with a custom background colour', async () => {
    const url = buildUrl('h_10,w_50/flatten,bg_red');
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });
});
