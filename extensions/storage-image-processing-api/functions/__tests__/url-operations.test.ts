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

const buildUrlwithGcsImage = (operations: string) => {
  return `${buildUrl(`input:type_gcs,source_invertase.jpeg/${operations}`)}`;
};

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

    test.skip('successfully creates a new image with a convolve operation', async () => {
      const url = buildUrl('convolve: height_3,width_3,kernel_-101-202-101');

      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('affine', () => {
    xtest('successfully creates a new image with an affine operation', async () => {
      const url = buildUrl('affine:matrix_1111');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('blur', () => {
    test('successfully creates a new image with a blur operation', async () => {
      const url = buildUrl('blur:sigma_10');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('clahe', () => {
    test('successfully creates a new image with a clahe operation', async () => {
      const url = buildUrl('clahe:width_10,height_10');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('composite', () => {
    test.skip('successfully creates a new image with a composite operation from a remote source', async () => {
      const url = buildUrl('composite:input_remoteImgUrl');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('composite', () => {
    test.skip('successfully creates a new image with a composite operation from a gcs source', async () => {
      const url = buildUrl('composite/input_gcs_melos.png');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test.skip('successfully creates a new image with a composite operation from a created source', async () => {
      const url = buildUrl('composite/input:create/www.google.com');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('extend', () => {
    test('successfully creates a new image with an extend all operation', async () => {
      const url = buildUrl('extend:all_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend top operation', async () => {
      const url = buildUrl('extend:top_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend left operation', async () => {
      const url = buildUrl('extend:left:_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend bottom operation', async () => {
      const url = buildUrl('extend:bottom_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extend right operation', async () => {
      const url = buildUrl('extend:right_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('extract', () => {
    test('successfully creates a new image with an extract width and height operation', async () => {
      const url = buildUrl('extract:width_3,height_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extract width, height and top operation', async () => {
      const url = buildUrl('extract:width_3,height_3,top_3');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with an extract width, height and left operation', async () => {
      const url = buildUrl('extract:width_3,height_3,left_3');

      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flatten', () => {
    xtest('successfully creates a new image with an flatten background with a color description', async () => {
      const url = buildUrl('flatten:bg_black');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flip', () => {
    test('successfully creates a new image with a flip operator', async () => {
      const url = buildUrl('flip');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Flop', () => {
    test('successfully creates a new image with a flip operator', async () => {
      const url = buildUrl('flop');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Gamma', () => {
    test('successfully creates a new image with a gamma operator and gamma option', async () => {
      const url = buildUrl('gamma:gamma_2.0 ');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a gamma operator and gammaOut option', async () => {
      const url = buildUrl('gamma:gammaOut_2.0');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Grayscale', () => {
    test('successfully creates a new image with a grayscale operator and a truthy grayscale option', async () => {
      const url = buildUrl('grayscale:grayscale_true');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a grayscale operator and a false grayscale option', async () => {
      const url = buildUrl('grayscale:grayscale_false');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a grayscale operator while defaulting to a truthy value', async () => {
      const url = buildUrl('grayscale');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });
  });

  describe('Linear', () => {
    test('successfully creates a new image with a linear operator and an a option', async () => {
      const url = buildUrl('linear:a_2.0 }');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a linear operator and an b option', async () => {
      const url = buildUrl('linear:b_2.0');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    test('successfully creates a new image with a linear operator and no options selected', async () => {
      const url = buildUrl('linear');
      const { status } = await axios.get(url);

      expect(status).toBe(200);
    });

    describe('Median', () => {
      test('successfully creates a new image with a median operator and a size option', async () => {
        const url = buildUrl('median:size_3');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a median operator and no options selected', async () => {
        const url = buildUrl('median');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Modulate', () => {
      test('successfully creates a new image with a modulate operator and a brightness option', async () => {
        const url = buildUrl('modulate:brightness_3');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and a saturation option', async () => {
        const url = buildUrl('modulate:saturation_3');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and a hue option', async () => {
        const url = buildUrl('modulate:hue_3');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test.skip('successfully creates a new image with a modulate operator and a lightness option', async () => {
        const url = buildUrl('modulate:lightness_3');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a modulate operator and no options selected', async () => {
        const url = buildUrl('modulate');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Negate', () => {
      test('successfully creates a new image with a negate operator', async () => {
        const url = buildUrl('negate');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Recomb', () => {
      xtest('successfully creates a new image with a recomb operator and a matrix array', async () => {
        const url = buildUrl(
          'recomb:matrix_0.3588,0.7044,0.1368,0.299,0.587,0.114,0.2392,0.4696,0.0912',
        );
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Resize', () => {
      test('successfully creates a new image with an with height and width provided', async () => {
        const url = buildUrl('resize:height_20,width_20');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      describe('position', () => {
        test('successfully creates a new with a fit operation and cover type', async () => {
          const url = buildUrl('resize:height_20,width_20,fit_cover');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and contain type', async () => {
          const url = buildUrl('resize:height_20,width_20,fit_contain');

          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and fill type', async () => {
          const url = buildUrl('resize:height_20,width_20,fit_fill');

          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and inside type', async () => {
          const url = buildUrl('resize:height_20,width_20,fit_inside');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a fit operation and outside type', async () => {
          const url = buildUrl('resize:height_20,width_20,fit_outside');

          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });
      });

      describe('kernel', () => {
        test('successfully creates a new image with a kernel operation and nearest option', async () => {
          const url = buildUrl('resize:kernel_nearest');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and cubic option', async () => {
          const url = buildUrl('resize:kernel_cubic');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test.skip('successfully creates a new image with a kernel and mitchell option', async () => {
          const url = buildUrl('resize:kernel_mitchell');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and lanczos2 option', async () => {
          const url = buildUrl('resize:kernel_lanczos2');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        test('successfully creates a new image with a kernel and lanczos3 option', async () => {
          const url = buildUrl('resize:kernel_lanczos3');
          const { status } = await axios.get(url);

          expect(status).toBe(200);
        });

        describe('background', () => {
          test('successfully creates a new image with a background option', async () => {
            const url = buildUrl('resize:background_black');
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });

        describe('withoutEnlargement', () => {
          test('successfully creates a new image with a withoutEnlargement truthy option', async () => {
            const url = buildUrl('resize:withoutEnlargement_true');
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });

          test('successfully creates a new image with a withoutEnlargement false option', async () => {
            const url = buildUrl('resize:withoutEnlargement_false');
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });

        describe('fastShrinkOnLoad', () => {
          test('successfully creates a new image with a fastShrinkOnLoad truthy option', async () => {
            const url = buildUrl('resize:fastShrinkOnLoad_true');
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });

          test('successfully creates a new image with a fastShrinkOnLoad false option', async () => {
            const url = buildUrl('resize:fastShrinkOnLoad_false');
            const { status } = await axios.get(url);

            expect(status).toBe(200);
          });
        });
      });
    });

    describe('Rotate', () => {
      test('successfully creates a new image with a rotate operator', async () => {
        const url = buildUrl('rotate:angle_250');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Sharpen', () => {
      test('successfully creates a new image with a sharpen operator and no options', async () => {
        const url = buildUrl('sharpen');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a sigma option', async () => {
        const url = buildUrl('sharpen:sigma_20');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a flat option', async () => {
        const url = buildUrl('sharpen:flat_20');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });

      test('successfully creates a new image with a sharpen operator and a jagged option', async () => {
        const url = buildUrl('sharpen:jagged_20');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Text', () => {
      test('successfully creates a new image with a text operator and a value', async () => {
        const url = buildUrl('w:500/h:500/text:value_testing');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Threshold', () => {
      test('successfully creates a new image with a threshold operator and no options', async () => {
        const url = buildUrl('threshold');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Tint', () => {
      test('successfully creates a new image with a tint operator an rgb option', async () => {
        const url = buildUrl('tint:rgb_blue');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });

    describe('Trim', () => {
      test('successfully creates a new image with a trim operator and no options', async () => {
        const url = buildUrlwithGcsImage('trim');
        const { status } = await axios.get(url);

        expect(status).toBe(200);
      });
    });
  });

  describe('utilities', () => {
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
  });
});
