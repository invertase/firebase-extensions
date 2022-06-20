import axios from 'axios';

const apiEndpointUrl =
  'http://localhost:5001/extensions-testing/europe-west2/handler/process';

const remoteImgUrl =
  'https://images.unsplash.com/photo-1512546321483-c0468b7b8a95';

const buildUrl = (...operations) =>
  `${apiEndpointUrl}?operations=${encodeURIComponent(
    JSON.stringify([
      { operation: 'input', type: 'url', url: remoteImgUrl },
      ...operations,
      { operation: 'output', format: 'jpeg' },
    ]),
  )}`;

describe('operations testing', () => {
  test('successfully creates a new image with an affine operation', async () => {
    const url = buildUrl({ operation: 'affine', matrix: [1, 0.3, 0.1, 0.7] });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test('successfully creates a new image with a blur operation', async () => {
    const url = buildUrl({ operation: 'blur', sigma: 10 });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test('successfully creates a new image with a clahe operation', async () => {
    const url = buildUrl({ operation: 'clahe', width: 10, height: 10 });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test.skip('successfully creates a new image with a composite operation from a remote source', async () => {
    const url = buildUrl({ operation: 'composite', input: remoteImgUrl });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test.skip('successfully creates a new image with a composite operation from a gcs source', async () => {
    const url = buildUrl({ operation: 'composite', input: 'melos.png' });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test.skip('successfully creates a new image with a composite operation from a created source', async () => {
    const url = buildUrl({ operation: 'composite', input: buildUrl() });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  test.skip('successfully creates a new image with a convolve operation', async () => {
    const url = buildUrl({
      operation: 'convolve',
      width: 3,
      height: 3,
      kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    });
    const { status } = await axios.get(url);

    expect(status).toBe(200);
  });

  describe('extend', () => {
    test('successfully creates a new image with an extend all operation', async () => {
      const url = buildUrl({ operation: 'extend', all: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend top operation', async () => {
      const url = buildUrl({ operation: 'extend', top: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend left operation', async () => {
      const url = buildUrl({ operation: 'extend', left: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend bottom operation', async () => {
      const url = buildUrl({ operation: 'extend', bottom: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend right operation', async () => {
      const url = buildUrl({ operation: 'extend', right: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('extract', () => {
    test('successfully creates a new image with an extract width and height operation', async () => {
      const url = buildUrl({ operation: 'extract', width: 3, height: 3 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extract width, height and top operation', async () => {
      const url = buildUrl({
        operation: 'extract',
        width: 3,
        height: 3,
        top: 3,
      });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extract width, height and left operation', async () => {
      const url = buildUrl({
        operation: 'extract',
        width: 3,
        height: 3,
        left: 3,
      });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flatten', () => {
    test('successfully creates a new image with an flatten background with a color description', async () => {
      const url = buildUrl({ operation: 'flatten', background: 'black' });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flip', () => {
    test('successfully creates a new image with a flip operator', async () => {
      const url = buildUrl({ operation: 'flip' });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flop', () => {
    test('successfully creates a new image with a flip operator', async () => {
      const url = buildUrl({ operation: 'flop' });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Gamma', () => {
    test('successfully creates a new image with a gamma operator and gamma option', async () => {
      const url = buildUrl({ operation: 'gamma', gamma: 2.0 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a gamma operator and gammaOut option', async () => {
      const url = buildUrl({ operation: 'gamma', gammaOut: 2.0 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Grayscale', () => {
    test('successfully creates a new image with a grayscale operator and a truthy grayscale option', async () => {
      const url = buildUrl({ operation: 'grayscale', grayscale: true });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a grayscale operator and a false grayscale option', async () => {
      const url = buildUrl({ operation: 'grayscale', grayscale: false });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a grayscale operator while defaulting to a truthy value', async () => {
      const url = buildUrl({ operation: 'grayscale' });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Linear', () => {
    test('successfully creates a new image with a linear operator and an a option', async () => {
      const url = buildUrl({ operation: 'linear', a: 2.0 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a linear operator and an b option', async () => {
      const url = buildUrl({ operation: 'linear', b: 2.0 });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a linear operator and no options selected', async () => {
      const url = buildUrl({ operation: 'linear' });
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    describe('Median', () => {
      test('successfully creates a new image with a median operator and a size option', async () => {
        const url = buildUrl({ operation: 'median', size: 3 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a median operator and no options selected', async () => {
        const url = buildUrl({ operation: 'median' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Modulate', () => {
      test('successfully creates a new image with a modulate operator and a brightness option', async () => {
        const url = buildUrl({ operation: 'modulate', brightness: 3 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and a saturation option', async () => {
        const url = buildUrl({ operation: 'modulate', saturation: 3 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and a hue option', async () => {
        const url = buildUrl({ operation: 'modulate', hue: 3 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test.skip('successfully creates a new image with a modulate operator and a lightness option', async () => {
        const url = buildUrl({ operation: 'modulate', lightness: 3 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and no options selected', async () => {
        const url = buildUrl({ operation: 'modulate' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Negate', () => {
      test('successfully creates a new image with a negate operator', async () => {
        const url = buildUrl({ operation: 'negate' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Recomb', () => {
      test('successfully creates a new image with a recomb operator and a matrix array', async () => {
        const url = buildUrl({
          operation: 'recomb',
          matrix: [
            [0.3588, 0.7044, 0.1368],
            [0.299, 0.587, 0.114],
            [0.2392, 0.4696, 0.0912],
          ],
        });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Resize', () => {
      test('successfully creates a new image with an with height and width provided', async () => {
        const url = buildUrl({ operation: 'resize', height: 20, width: 20 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      describe('position', () => {
        test('successfully creates a new with a fit operation and cover type', async () => {
          const url = buildUrl({
            operation: 'resize',
            height: 20,
            width: 20,
            fit: 'cover',
          });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and contain type', async () => {
          const url = buildUrl({
            operation: 'resize',
            height: 20,
            width: 20,
            fit: 'contain',
          });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and fill type', async () => {
          const url = buildUrl({
            operation: 'resize',
            height: 20,
            width: 20,
            fit: 'fill',
          });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and inside type', async () => {
          const url = buildUrl({
            operation: 'resize',
            height: 20,
            width: 20,
            fit: 'inside',
          });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and outside type', async () => {
          const url = buildUrl({
            operation: 'resize',
            height: 20,
            width: 20,
            fit: 'outside',
          });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });
      });

      describe('kernel', () => {
        test('successfully creates a new image with a kernel operation and nearest option', async () => {
          const url = buildUrl({ operation: 'resize', kernel: 'nearest' });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and cubic option', async () => {
          const url = buildUrl({ operation: 'resize', kernel: 'cubic' });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test.skip('successfully creates a new image with a kernel and mitchell option', async () => {
          const url = buildUrl({ operation: 'resize', kernel: 'mitchell' });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and lanczos2 option', async () => {
          const url = buildUrl({ operation: 'resize', kernel: 'lanczos2' });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and lanczos3 option', async () => {
          const url = buildUrl({ operation: 'resize', kernel: 'lanczos3' });
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        describe('background', () => {
          test('successfully creates a new image with a background option', async () => {
            const url = buildUrl({ operation: 'resize', background: 'black' });
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });

        describe('withoutEnlargement', () => {
          test('successfully creates a new image with a withoutEnlargement truthy option', async () => {
            const url = buildUrl({
              operation: 'resize',
              withoutEnlargement: true,
            });
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });

          test('successfully creates a new image with a withoutEnlargement false option', async () => {
            const url = buildUrl({
              operation: 'resize',
              withoutEnlargement: false,
            });
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });

        describe('fastShrinkOnLoad', () => {
          test('successfully creates a new image with a fastShrinkOnLoad truthy option', async () => {
            const url = buildUrl({
              operation: 'resize',
              fastShrinkOnLoad: true,
            });
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });

          test('successfully creates a new image with a fastShrinkOnLoad false option', async () => {
            const url = buildUrl({
              operation: 'resize',
              fastShrinkOnLoad: false,
            });
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });
      });
    });

    describe('Rotate', () => {
      test('successfully creates a new image with a rotate operator', async () => {
        const url = buildUrl({ operation: 'rotate', angle: 250 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Sharpen', () => {
      test('successfully creates a new image with a sharpen operator and no options', async () => {
        const url = buildUrl({ operation: 'sharpen' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a sigma option', async () => {
        const url = buildUrl({ operation: 'sharpen', sigma: 20 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a flat option', async () => {
        const url = buildUrl({ operation: 'sharpen', flat: 20 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a jagged option', async () => {
        const url = buildUrl({ operation: 'sharpen', jagged: 20 });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Text', () => {
      test('successfully creates a new image with a text operator and a value', async () => {
        const url = buildUrl({ operation: 'text', value: 'testing' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Threshold', () => {
      test('successfully creates a new image with a threshold operator and no options', async () => {
        const url = buildUrl({ operation: 'threshold' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Tint', () => {
      test('successfully creates a new image with a tint operator an rgb option', async () => {
        const url = buildUrl({ operation: 'tint', rgb: 'blue' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Trim', () => {
      test('successfully creates a new image with a trim operator and no options', async () => {
        const url = buildUrl({ operation: 'trim' });
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });
  });
});
