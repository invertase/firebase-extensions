import React, { useState } from 'react';

export default () => {
  const [imageSrc, setImageSrc] = useState('');

  return (
    <div>
      <div>url:</div>
      <img src={imageSrc} />
      <input type="text" onChange={({ target }) => setImageSrc(target.value)} />
    </div>
  );
};
