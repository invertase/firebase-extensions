import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp({
  projectId: 'extensions-testing',
});

const imgSrc =
  'http://localhost:5001/extensions-testing/europe-west2/handler/process/input~type:url~url:https%3A%2F%2Fimages.unsplash.com%2Fphoto-1624216873925-9c86b448a64c%3Fixid%3DMnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%253D%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D900%26q%3D60';

describe('e2e testing', () => {
  test('successfully generate an image', async () => {
    const { status } = await axios
      .get(
        `${imgSrc}/flatten~background:black/threshold~threshold:255~grayscale:false/text~value:Invertase/output~format:jpeg`,
      )
      .then(response => response);

    expect(status).toBe(200);
  });

  test('throws an error with an invalid operation', async () => {
    try {
      await axios.get(`${imgSrc}/unknown:unknown/output~format:jpeg`);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe(
        "Options for the 'unknown:unknown' operation (at position 1) are invalid: Operation of type 'unknown:unknown' does not exist or is unsupported.",
      );
    }
  });

  test('throws an error if an input operation is not the first operation', async () => {
    try {
      await axios.get(
        `http://localhost:5001/extensions-testing/europe-west2/handler/process/output~format:jpeg`,
      );
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe(
        'An input operation must be the first operation.',
      );
    }
  });

  test('throws an error if an output operation is not the last operation', async () => {
    try {
      await axios.get(`${imgSrc}/flatten~background`);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe(
        'An output operation must be the last operation.',
      );
    }
  });
});
