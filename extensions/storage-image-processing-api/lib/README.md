# Storage Image Processing API Utilities

This package contains utilities for interacting with the Firebase Storage Image Processing API Extension.

## Installation

```bash
npm i --save @invertase/storage-image-processing-api
```

## Usage

### `builder`

Returns a `StorageImageProcessingApi` instance which can be used to build an array of operations to be applied to an image via the extension.

```ts
import { builder } from '@invertase/storage-image-processing-api';

const output = builder()
  // Input required
  .input({
    source: 'https://example.com/image.jpg',
  })
  .flip()
  .grayscale()
  .rotate({ angle: 90 })
  // Output required
  .output({
    format: 'png',
  });
```

Once created, the api provides the means to return the operations as JSON, a JSON string or an encoded JSON string suitable for GET requests in your browser.

```ts
const json = output.toJSON();
const jsonString = output.toJSONString();
const encodedJsonString = output.toEncodedJSONString();
```