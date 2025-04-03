import { describe, it } from 'vitest';
import {
  assertOperationSuccess,
  remoteImgUrl,
  buildUrl,
  testTimeout,
} from '../utils';

describe('image operations', () => {
  it(
    'affine',
    async () => {
      await assertOperationSuccess([
        { operation: 'affine', matrix: [1, 0.3, 0.1, 0.7] },
      ]);
    },
    testTimeout,
  );

  it(
    'blur',
    async () => {
      await assertOperationSuccess([{ operation: 'blur', sigma: 10 }]);
    },
    testTimeout,
  );

  it(
    'clahe',
    async () => {
      await assertOperationSuccess([
        { operation: 'clahe', width: 10, height: 10 },
      ]);
    },
    testTimeout,
  );

  it.skip(
    'composite (remote)',
    async () => {
      await assertOperationSuccess([
        { operation: 'composite', input: remoteImgUrl },
      ]);
    },
    testTimeout,
  );

  it.skip(
    'composite (gcs)',
    async () => {
      await assertOperationSuccess([
        { operation: 'composite', input: 'melos.png' },
      ]);
    },
    testTimeout,
  );

  it.skip(
    'composite (nested buildUrl)',
    async () => {
      await assertOperationSuccess([
        { operation: 'composite', input: buildUrl() },
      ]);
    },
    testTimeout,
  );

  it.skip(
    'convolve',
    async () => {
      await assertOperationSuccess([
        {
          operation: 'convolve',
          width: 3,
          height: 3,
          kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
        },
      ]);
    },
    testTimeout,
  );

  for (const key of ['all', 'top', 'left', 'bottom', 'right']) {
    it(
      `extend ${key}`,
      async () => {
        await assertOperationSuccess([{ operation: 'extend', [key]: 3 }]);
      },
      testTimeout,
    );
  }

  it(
    'extract width/height',
    async () => {
      await assertOperationSuccess([
        { operation: 'extract', width: 3, height: 3 },
      ]);
    },
    testTimeout,
  );

  it(
    'extract top',
    async () => {
      await assertOperationSuccess([
        { operation: 'extract', width: 3, height: 3, top: 3 },
      ]);
    },
    testTimeout,
  );

  it(
    'extract left',
    async () => {
      await assertOperationSuccess([
        { operation: 'extract', width: 3, height: 3, left: 3 },
      ]);
    },
    testTimeout,
  );

  it(
    'flatten',
    async () => {
      await assertOperationSuccess([
        { operation: 'flatten', background: 'black' },
      ]);
    },
    testTimeout,
  );

  it(
    'flip',
    async () => {
      await assertOperationSuccess([{ operation: 'flip' }]);
    },
    testTimeout,
  );

  it(
    'flop',
    async () => {
      await assertOperationSuccess([{ operation: 'flop' }]);
    },
    testTimeout,
  );

  it(
    'gamma',
    async () => {
      await assertOperationSuccess([{ operation: 'gamma', gamma: 2.0 }]);
    },
    testTimeout,
  );

  it(
    'gammaOut',
    async () => {
      await assertOperationSuccess([{ operation: 'gamma', gammaOut: 2.0 }]);
    },
    testTimeout,
  );

  it(
    'grayscale (true)',
    async () => {
      await assertOperationSuccess([
        { operation: 'grayscale', grayscale: true },
      ]);
    },
    testTimeout,
  );

  it(
    'grayscale (false)',
    async () => {
      await assertOperationSuccess([
        { operation: 'grayscale', grayscale: false },
      ]);
    },
    testTimeout,
  );

  it(
    'grayscale (default)',
    async () => {
      await assertOperationSuccess([{ operation: 'grayscale' }]);
    },
    testTimeout,
  );

  for (const variant of [{ a: 2.0 }, { b: 2.0 }, {}]) {
    const label = Object.keys(variant).length
      ? JSON.stringify(variant)
      : 'no options';
    it(
      `linear (${label})`,
      async () => {
        await assertOperationSuccess([{ operation: 'linear', ...variant }]);
      },
      testTimeout,
    );
  }

  it(
    'median (size)',
    async () => {
      await assertOperationSuccess([{ operation: 'median', size: 3 }]);
    },
    testTimeout,
  );

  it(
    'median (default)',
    async () => {
      await assertOperationSuccess([{ operation: 'median' }]);
    },
    testTimeout,
  );

  for (const key of ['brightness', 'saturation', 'hue']) {
    it(
      `modulate (${key})`,
      async () => {
        await assertOperationSuccess([{ operation: 'modulate', [key]: 3 }]);
      },
      testTimeout,
    );
  }

  it(
    'modulate (none)',
    async () => {
      await assertOperationSuccess([{ operation: 'modulate' }]);
    },
    testTimeout,
  );

  it.skip(
    'modulate (lightness)',
    async () => {
      await assertOperationSuccess([{ operation: 'modulate', lightness: 3 }]);
    },
    testTimeout,
  );

  it(
    'negate',
    async () => {
      await assertOperationSuccess([{ operation: 'negate' }]);
    },
    testTimeout,
  );

  it(
    'recomb matrix',
    async () => {
      await assertOperationSuccess([
        {
          operation: 'recomb',
          matrix: [
            [0.3588, 0.7044, 0.1368],
            [0.299, 0.587, 0.114],
            [0.2392, 0.4696, 0.0912],
          ],
        },
      ]);
    },
    testTimeout,
  );

  it(
    'resize height/width',
    async () => {
      await assertOperationSuccess([
        { operation: 'resize', height: 20, width: 20 },
      ]);
    },
    testTimeout,
  );

  for (const fit of ['cover', 'contain', 'fill', 'inside', 'outside']) {
    it(
      `resize fit: ${fit}`,
      async () => {
        await assertOperationSuccess([
          { operation: 'resize', height: 20, width: 20, fit },
        ]);
      },
      testTimeout,
    );
  }

  for (const kernel of ['nearest', 'cubic', 'lanczos2', 'lanczos3']) {
    it(
      `resize kernel: ${kernel}`,
      async () => {
        await assertOperationSuccess([{ operation: 'resize', kernel }]);
      },
      testTimeout,
    );
  }

  it.skip(
    'resize kernel: mitchell',
    async () => {
      await assertOperationSuccess([
        { operation: 'resize', kernel: 'mitchell' },
      ]);
    },
    testTimeout,
  );

  it(
    'resize background',
    async () => {
      await assertOperationSuccess([
        { operation: 'resize', background: 'black' },
      ]);
    },
    testTimeout,
  );

  for (const val of [true, false]) {
    it(
      `resize withoutEnlargement: ${val}`,
      async () => {
        await assertOperationSuccess([
          { operation: 'resize', withoutEnlargement: val },
        ]);
      },
      testTimeout,
    );

    it(
      `resize fastShrinkOnLoad: ${val}`,
      async () => {
        await assertOperationSuccess([
          { operation: 'resize', fastShrinkOnLoad: val },
        ]);
      },
      testTimeout,
    );
  }

  it(
    'rotate',
    async () => {
      await assertOperationSuccess([{ operation: 'rotate', angle: 250 }]);
    },
    testTimeout,
  );

  for (const variant of [{}, { sigma: 20 }, { flat: 20 }, { jagged: 20 }]) {
    const label = Object.keys(variant).length
      ? JSON.stringify(variant)
      : 'default';
    it(
      `sharpen (${label})`,
      async () => {
        await assertOperationSuccess([{ operation: 'sharpen', ...variant }]);
      },
      testTimeout,
    );
  }

  it(
    'text',
    async () => {
      await assertOperationSuccess([{ operation: 'text', value: 'testing' }]);
    },
    testTimeout,
  );

  it(
    'threshold',
    async () => {
      await assertOperationSuccess([{ operation: 'threshold' }]);
    },
    testTimeout,
  );

  it(
    'tint',
    async () => {
      await assertOperationSuccess([{ operation: 'tint', rgb: 'blue' }]);
    },
    testTimeout,
  );

  it(
    'trim',
    async () => {
      await assertOperationSuccess([{ operation: 'trim' }]);
    },
    testTimeout,
  );
});
