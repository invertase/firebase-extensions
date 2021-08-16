'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const react_1 = __importStar(require('react'));
const imageOperations = [
  { name: 'Rotate 180', key: 'rotate', value: ['angle', 180] },
  { name: 'Rotate 360', key: 'rotate', value: ['angle', 360] },
  { name: 'Rotate 900', key: 'rotate', value: ['angle', 900] },
  { name: 'Grayscale', key: 'grayscale', value: ['grayscale', true] },
];
const inputOperations = [
  {
    name: 'New Image (200x 200)',
    key: 'type',
    value: ['create', 'width:200~height:200'],
  },
  {
    name: 'New Image (400x 400)',
    key: 'type',
    value: ['create', 'width:400~height:400'],
  },
  {
    name: 'New Image (600x 1200)',
    key: 'type',
    value: ['create', 'width:600~height:1200'],
  },
  {
    name: 'New Image (800x 1400)',
    key: 'type',
    value: ['create', 'width:800~height:1400'],
  },
  {
    name: 'Beagle',
    key: 'type',
    value: ['url', 'url:https%3A%2F%2Ftinyurl.com%2Fhkeujyyz'],
  },
];
const baseUrl =
  'https://europe-west2-extensions-testing.cloudfunctions.net/ext-storage-image-processing-api-handler/process';
const renderOperations = operations =>
  Object.keys(operations)
    .map(o => {
      const [key, value] = operations[o];
      const prop = value ? `${key}:${value}` : `${key}`;
      return `${o}~${prop}`;
    })
    .join('/');
const renderInput = input =>
  Object.keys(input)
    .map(o => {
      const [key, value] = input[o];
      const prop = value ? `${key}~${value}` : `${key}`;
      return `${o}:${prop}`;
    })
    .join('~');
const generateUrl = (input, operations) =>
  `${baseUrl}/input~${renderInput(input)}/${renderOperations(
    operations,
  )}/output~format:jpeg`;
const InteractiveExample = () => {
  const [input, setInput] = react_1.useState({
    type: ['create', 'width:200~height:100'],
  });
  const [operations, setOperations] = react_1.useState({
    flatten: ['background', 'black'],
    text: ['value', 'Invertase'],
  });
  const [url, setUrl] = react_1.useState(generateUrl(input, operations));
  const [loading, setLoading] = react_1.useState(false);
  const onChangeOperation = (key, value) => {
    const ops = operations;
    ops[key] = value;
    console.log('here >>>');
    setLoading(true);
    setOperations(ops);
    setUrl(generateUrl(input, operations));
    setLoading(false);
  };
  const onChangeInput = (key, value) => {
    const i = input;
    i[key] = value;
    console.log('here >>>');
    setLoading(true);
    setInput(i);
    setUrl(generateUrl(i, operations));
    setLoading(false);
  };
  if (loading)
    return react_1.default.createElement('div', null, 'Processing...');
  return react_1.default.createElement(
    'div',
    { className: 'w-full' },
    react_1.default.createElement(
      'div',
      { className: 'flex flex-col space-y-4' },
      react_1.default.createElement(
        'div',
        { className: 'w-full' },
        react_1.default.createElement('img', { src: url, className: 'w-full' }),
      ),
      react_1.default.createElement(
        'div',
        { className: 'flex justify-around w-full space-x-4' },
        react_1.default.createElement(
          'div',
          { className: 'flex flex-col w-full space-y-2' },
          react_1.default.createElement(
            'label',
            { className: 'text-sm text-gray-500' },
            'Input Type',
          ),
          inputOperations.map(({ name, key, value }) =>
            react_1.default.createElement(
              'div',
              {
                className: 'p-2 bg-gray-400 text-white',
                onClick: () => onChangeInput(key, value),
              },
              name,
            ),
          ),
        ),
        react_1.default.createElement(
          'div',
          { className: 'flex flex-col w-full space-y-2' },
          react_1.default.createElement(
            'label',
            { className: 'text-sm text-gray-500' },
            'Image Operations',
          ),
          imageOperations.map(({ name, key, value }) =>
            react_1.default.createElement(
              'div',
              {
                className: 'p-2 bg-gray-400 text-white',
                onClick: () => onChangeOperation(key, value),
              },
              name,
            ),
          ),
        ),
        react_1.default.createElement(
          'div',
          { className: 'flex flex-col w-full' },
          react_1.default.createElement(
            'label',
            { className: 'text-sm text-gray-500' },
            'Height (px)',
          ),
          react_1.default.createElement('input', {
            type: 'number',
            className: 'border-4 border-blue-500 border-opacity-25',
            onChange: ({ target }) =>
              onChangeOperation(
                /text~value:[a-zA-Z]*/,
                `text~value:${target.value}`,
              ),
          }),
        ),
        react_1.default.createElement(
          'div',
          { className: 'flex flex-col w-full' },
          react_1.default.createElement(
            'label',
            { className: 'text-sm text-gray-500' },
            'Width (px)',
          ),
          react_1.default.createElement('input', {
            type: 'number',
            className: 'border-4 border-blue-500 border-opacity-25',
          }),
        ),
        react_1.default.createElement(
          'div',
          { className: 'flex flex-col w-full' },
          react_1.default.createElement(
            'label',
            { className: 'text-sm text-gray-500' },
            'Text',
          ),
          react_1.default.createElement('input', {
            type: 'text',
            className: 'border-4 border-blue-500 border-opacity-25',
            onChange: ({ target }) =>
              onChangeOperation(
                /text~value:[a-zA-Z]*/,
                `text~value:${target.value}`,
              ),
          }),
        ),
      ),
      react_1.default.createElement(
        'div',
        { className: 'flex justify-center p-4' },
        url,
      ),
    ),
  );
};
exports.default = InteractiveExample;
