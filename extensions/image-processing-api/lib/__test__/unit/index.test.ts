import { describe, it, expect } from 'vitest';
import { builder } from '../../src'; // Adjust this path if needed

describe('ImageProcessingApi builder', () => {
  it('should throw if input is missing', () => {
    expect(() => builder().output({ jpeg: {} }).toJSON()).toThrow();
  });

  it('should throw if output is missing', () => {
    expect(() =>
      builder()
        .input({ type: 'url', url: 'https://example.com/image.jpg' })
        .toJSON(),
    ).toThrow();
  });

  it('should include input and output correctly', () => {
    const ops = builder()
      .input({ type: 'url', url: 'https://example.com/image.jpg' })
      .output({ jpeg: {} })
      .toJSON();

    expect(ops[0]).toEqual({
      operation: 'input',
      type: 'url',
      url: 'https://example.com/image.jpg',
    });

    expect(ops[ops.length - 1]).toEqual({
      operation: 'output',
      format: 'jpeg',
    });
  });

  it('should handle all operation types', () => {
    const api = builder()
      .input({ type: 'url', url: 'https://example.com/image.jpg' })
      .affine({ matrix: [1, 0, 0, 1] })
      .blur({ sigma: 2 })
      .clahe({ width: 10, height: 10 })
      .colorspace({ colorspace: 'b-w' })
      .composite({
        input: 'https://example.com/overlay.png',
        blend: 'over',
        density: 300,
      })
      .convolve({ width: 3, height: 3, kernel: [1, 0, -1, 0, 0, 0, -1, 0, 1] })
      .extend({ top: 5 })
      .extract({ width: 100, height: 100, left: 10, top: 10 })
      .flatten({ background: 'white' })
      .flip()
      .flop()
      .gamma({ gamma: 2.2 })
      .grayscale()
      .linear({ a: 2, b: 3 })
      .median({ size: 5 })
      .modulate({ brightness: 1.5 })
      .negate()
      .recomb({
        matrix: [
          [0.5, 0.5, 0],
          [0.5, 0.5, 0],
          [0, 0, 1],
        ],
      })
      .resize({ width: 200, height: 150 })
      .rotate({ angle: 90 })
      .sharpen({ sigma: 1.5, flat: 0.5, jagged: 1 })
      .text({
        value: 'Hello world',
        blend: 'over',
        font: 'Arial',
        textColor: 'black',
        strokeWidth: 1,
        strokeColor: 'white',
        padding: 5,
        borderWidth: 1,
        borderColor: 'black',
        maxWidth: 300,
      })
      .threshold({ threshold: 128 })
      .tint({ rgb: 'blue' })
      .trim({ threshold: 10 })
      .output({ webp: {} });

    const operations = api.toJSON();

    expect(operations[0]).toEqual({
      operation: 'input',
      type: 'url',
      url: 'https://example.com/image.jpg',
    });

    expect(operations.some(op => op.operation === 'grayscale')).toBe(true);
    expect(operations.some(op => op.operation === 'trim')).toBe(true);
    expect(operations[operations.length - 1]).toEqual({
      operation: 'output',
      format: 'webp',
    });

    expect(() => api.toEncodedString()).not.toThrow();
    expect(() => api.toString()).not.toThrow();
  });

  it('should handle "path" input', () => {
    const ops = builder()
      .input({ type: 'path', path: '/images/photo.jpg' })
      .output({ png: {} })
      .toJSON();

    expect(ops[0]).toEqual({
      operation: 'input',
      type: 'path',
      path: '/images/photo.jpg',
    });
  });

  it('should handle "create" input', () => {
    const ops = builder()
      .input({
        type: 'create',
        width: 100,
        height: 100,
        channels: 3,
        noiseMean: 0,
        format: 'png',
        noiseSigma: 0,
      })
      .output({ png: {} })
      .toJSON();

    expect(ops[0]).toEqual({
      operation: 'input',
      type: 'create',
    });
  });
});
