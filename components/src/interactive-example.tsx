import React, { createElement, HTMLProps, ReactNode, useState } from 'react';

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

const InteractiveExample = (): JSX.Element => {
  const [input, setInput] = useState({
    type: ['create', 'width:200~height:100'],
  });

  const [operations, setOperations] = useState({
    flatten: ['background', 'black'],
    text: ['value', 'Invertase'],
  });

  const [url, setUrl] = useState(generateUrl(input, operations));

  const [loading, setLoading] = useState(false);

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

  if (loading) return <div>Processing...</div>;
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <img src={url} className="w-full" />
        </div>
        <div className="flex justify-around w-full space-x-4">
          <div className="flex flex-col w-full space-y-2">
            <label className="text-sm text-gray-500">Input Type</label>
            {inputOperations.map(({ name, key, value }) => (
              <div
                className="p-2 bg-gray-400 text-white"
                onClick={() => onChangeInput(key, value)}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full space-y-2">
            <label className="text-sm text-gray-500">Image Operations</label>
            {imageOperations.map(({ name, key, value }) => (
              <div
                className="p-2 bg-gray-400 text-white"
                onClick={() => onChangeOperation(key, value)}
              >
                {name}
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500">Height (px)</label>
            <input
              type="number"
              className="border-4 border-blue-500 border-opacity-25"
              onChange={({ target }) =>
                onChangeOperation(
                  /text~value:[a-zA-Z]*/,
                  `text~value:${target.value}`,
                )
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500">Width (px)</label>
            <input
              type="number"
              className="border-4 border-blue-500 border-opacity-25"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-500">Text</label>
            <input
              type="text"
              className="border-4 border-blue-500 border-opacity-25"
              onChange={({ target }) =>
                onChangeOperation(
                  /text~value:[a-zA-Z]*/,
                  `text~value:${target.value}`,
                )
              }
            />
          </div>
        </div>

        <div className="flex justify-center p-4">{url}</div>
      </div>
    </div>
  );
};

export default InteractiveExample;
