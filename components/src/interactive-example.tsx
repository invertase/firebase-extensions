import React, { useState } from 'react';
import { FaCircleNotch } from 'react-icons/fa';

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

const baseUrl =
  'https://europe-west2-extensions-testing.cloudfunctions.net/ext-storage-image-processing-api-handler/process';

const InteractiveExample = (): JSX.Element => {
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState('');
  const [operations, setOperations] = useState([
    {
      operation: 'input',
      type: 'url',
      url: 'https://tinyurl.com/hkeujyyz',
    },
    {
      operation: 'output',
      format: 'png',
    },
  ]);

  const addOperation = () => {
    setLoading(true);

    const toUpdate = operations;

    toUpdate.splice(1, 0, editing);

    setOperations([...toUpdate]);
    setEditing(null);
    setOption(null);
    setLoading(false);
  };

  // const updateOperation = ({ operation, ...rest }) => {
  //   setLoading(true);

  //   const toUpdate = operations.filter($ => $.operation !== operation);

  //   //@ts-ignore
  //   toUpdate.splice(1, 0, { operation, ...rest });

  //   setOperations([...toUpdate]);
  //   setLoading(false);
  // };

  const removeOperation = operation => {
    setLoading(true);

    const toUpdate = operations.filter($ => $.operation !== operation);

    setOperations([...toUpdate]);
    setLoading(false);
  };

  const renderToggleButton = ({ operation, option }) => {
    const active = operations.some($ => $.operation === operation);

    const bgColor = active ? 'bg-green-300' : 'bg-red-300';

    return (
      <div
        className={`p-2 text-white ${bgColor} cursor-pointer`}
        onClick={() => {
          const toUpdate = editing || { operation };

          toUpdate[option.key] = !toUpdate[option.key];
          setEditing({ ...toUpdate });
        }}
      >
        {operation}
      </div>
    );
  };

  const renderNumberInput = ({ operation, option }) => {
    const value = editing ? editing[option.key] : null;
    return (
      <div className="flex flex-col">
        <label className={'capitalize'}>{option.key}</label>
        <input
          type="number"
          min="0.3"
          max="1000"
          step="0.1"
          value={value}
          className="p-2 text-black bg-white border border-black-200"
          placeholder={'eg. 10'}
          onBlur={({ target }) => {
            const toUpdate = editing || { operation };
            toUpdate[option.key] = parseInt(target.value);
            setEditing({ ...toUpdate });
          }}
        />
      </div>
    );
  };

  const renderTextInput = ({ operation, option }) => {
    const value = editing ? editing[option.key] : null;
    return (
      <div className="flex flex-col">
        <label className={'capitalize'}>{option.key}</label>
        <input
          type="text"
          value={value}
          placeholder={option.default || ''}
          className="p-2 text-black bg-white border border-black-200"
          onBlur={({ target }) => {
            const toUpdate = editing || { operation };
            toUpdate[option.key] = target.value;
            setEditing({ ...toUpdate });
          }}
        />
      </div>
    );
  };

  const renderImage = () => {
    return (
      <div className="relative">
        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full bg-black rounded-xl opacity-60">
            <div className="flex space-x-4">
              <div>Processing...</div>
              <FaCircleNotch
                size={24}
                className="border-b-4 border-green-900"
              />
            </div>
          </div>
        )}
        <img src={generateUrl} className="w-full" />
      </div>
    );
  };

  const generateUrl = `${baseUrl}?operations=${encodeURI(
    JSON.stringify(operations),
  )}`;

  console.log('>>>', operations);
  console.log('editing >>>', editing);

  const renderOperationWithOptions = ({ operation, options }) => {
    return (
      <div>
        <label className={'capitalize'}>{operation}</label>
        <div className="flex space-x-2">
          {options.map(option => {
            if (option.type === 'boolean') {
              return renderToggleButton({ operation, option });
            }

            if (option.type === 'string')
              return renderTextInput({ operation, option });

            if (option.type === 'number')
              return renderNumberInput({ operation, option });

            return null;
          })}
        </div>
      </div>
    );
  };

  const renderOperation = () => {
    if (!option.length) return null;

    const { operation, options } = types.filter($ => $.operation === option)[0];

    if (!options || !options.length) {
      const toUpdate = operations;
      const toAdd = {};
      // @ts-ignore
      toAdd.operation = `${operation}`;

      // @ts-ignore
      toUpdate.splice(1, 0, { ...toAdd });

      setOperations([...toUpdate]);
      setOption(null);
      return null;
    }

    return renderOperationWithOptions({ operation, options });
  };

  console.log(option);

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="w-full">{renderImage()}</div>
        <div className="flex space-x-4">
          {operations.map($ => (
            <div className={'px-2 bg-green-500 text-white flex space-x-2 z-10'}>
              <div
                onClick={() => {
                  setOption($.operation);
                  setEditing({ ...$ });
                }}
              >
                <div>{$.operation}</div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => removeOperation($.operation)}
              >
                x
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-around w-full space-x-4">
          <div className="flex flex-col w-full space-y-2">
            <label className="text-sm text-gray-500">Input Type</label>
          </div>
          <div className="flex flex-col w-full space-y-2">
            <label className="text-sm text-gray-500">Image Operations</label>

            <div>
              <select onChange={e => setOption(e.target.value)}>
                <option value={''}>--Please choose an option--</option>
                {types.map(({ operation }) => {
                  return <option value={operation}>{operation}</option>;
                })}
              </select>
            </div>

            {!!option && (
              <React.Fragment>
                {renderOperation()}
                <div
                  className="px-4 text-white bg-green-400 pointer-cursor"
                  onClick={() => addOperation()}
                >
                  Add Operation
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        <div className="justify-center p-4">{generateUrl}</div>
      </div>
    </div>
  );
};

export default InteractiveExample;
