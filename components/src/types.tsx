const types = [
  {
    operation: 'flip',
  },
  {
    operation: 'flop',
  },
  {
    operation: 'grayscale',
    options: [
      {
        key: 'grayscale',
        type: 'boolean',
        optional: true,
      },
    ],
  },
  //   {
  //     _meta: {
  //       label: 'Gamma',
  //       type: 'boolean',
  //     },
  //     input: 'gamma',
  //     operation: 'gamma',
  //   },
  //   {
  //     _meta: {
  //       label: 'Blur',
  //       type: 'boolean',
  //     },
  //     input: 'sigma',
  //     operation: 'blur',
  //   },
  //   {
  //     _meta: {
  //       label: 'Median',
  //       type: 'boolean',
  //     },
  //     input: 'size',
  //     operation: 'median',
  //   },
  //   {
  //     _meta: {
  //       label: 'Modulate',
  //       type: 'boolean',
  //     },
  //     input: 'size',
  //     operation: 'modulate',
  //   },
  //   {
  //     _meta: {
  //       label: 'Negate',
  //       type: 'boolean',
  //     },
  //     operation: 'negate',
  //   },
  //   {
  //     _meta: {
  //       label: 'Rotate',
  //     },
  //     input: 'angle',
  //     operation: 'rotate',
  //   },
  //   {
  //     _meta: {
  //       type: 'text',
  //       label: 'Tint',
  //       placeholder: 'eg. rgb(10, 2, 255)',
  //     },
  //     input: 'rgb',
  //     operation: 'tint',
  //   },
  //   {
  //     _meta: {
  //       label: 'Trim',
  //       type: 'number',
  //     },
  //     input: 'threshold',
  //     operation: 'trim',
  //   },
  //   {
  //     _meta: {
  //       label: 'Flatten',
  //       type: 'text',
  //       placeholder: 'eg. rgb(10, 2, 255)',
  //     },
  //     input: 'background',
  //     operation: 'flatten',
  //   },
  //   {
  //     _meta: {
  //       label: 'Colorspace',
  //       type: 'text',
  //       placeholder: 'eg. rgb16',
  //     },

  //     input: 'colorspace',
  //     operation: 'colorspace',
  //   },
  {
    operation: 'colorspace',
    options: [
      {
        key: 'threshold',
        type: 'number',
        optional: true,
        minValue: 0,
        maxValue: 255,
        default: 128,
      },
      {
        key: 'grayscale',
        type: 'boolean',
        optional: true,
      },
    ],
  },
  {
    operation: 'text',
    options: [
      {
        key: 'value',
        type: 'string',
        optional: true,
      },
      {
        key: 'font',
        type: 'string',
        optional: true,
        minValue: 0.01,
        maxValue: 1000,
        default: '30px sans-serif',
      },
      {
        key: 'top',
        type: 'number',
        optional: true,
      },
      {
        key: 'left',
        type: 'number',
        optional: true,
      },
      {
        key: 'textAlign',
        type: 'string',
        optional: true,
      },
      {
        key: 'textColor',
        type: 'string',
        optional: true,
        default: 'white',
      },
    ],
  },
];

export default types;
