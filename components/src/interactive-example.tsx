import React, { createElement, HTMLProps, ReactNode, useState } from 'react';

const InteractiveExample = (): JSX.Element => {
  // const [url, setUrl] = useState('https://tinyurl.com/hkeujyyz');
  const [url, setUrl] = useState(
    'https://europe-west2-extensions-testing.cloudfunctions.net/ext-storage-image-processing-api-handler/process/input~type:create~width:200~height:100/flatten~background:black/text~value:Invertase/output~format:jpeg',
  );

  const [loading, setLoading] = useState(false);

  const onChange = (regex, value) => {
    const newUrl = url.replace(regex, value);

    console.log('Updating >>>', regex, value, newUrl);
    setLoading(true);
    setUrl(newUrl);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <img src={url} className="w-full" />
          )}
        </div>
        <div className="flex justify-around w-full">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Image Type</label>
            <select className="border-4 border-blue-500 border-opacity-25 text-sm text-gray-500">
              <option value="create">Creation</option>
              <option value="source">Exisiting</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Height (px)</label>
            <input
              type="number"
              className="border-4 border-blue-500 border-opacity-25"
              onChange={({ target }) =>
                onChange(/text~value:[a-zA-Z]*/, `text~value:${target.value}`)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Width (px)</label>
            <input
              type="number"
              className="border-4 border-blue-500 border-opacity-25"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Text</label>
            <input
              type="text"
              className="border-4 border-blue-500 border-opacity-25"
              onChange={({ target }) =>
                onChange(/text~value:[a-zA-Z]*/, `text~value:${target.value}`)
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
