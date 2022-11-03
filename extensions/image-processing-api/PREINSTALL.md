Use this extension to optimize and transform images via a powerful HTTP API with over 30 different image operations to enhance and manipulate your images.

This extension creates a Cloud Function named `process`, which can be called via a GET request, specifiying
the operations to perform via the `operations` query parameter, for example:

```js
const operations = [
  {
    operation: 'input',
    type: 'url',
    url: 'https://example.com/image.jpg',
  },
  {
    operation: 'grayscale',
  },
  {
    operation: 'output',
    format: 'webp',
  },
];

const params = `?operations=${encodeURIComponent(JSON.stringify(operations))}`;
```

Input types are:

1. `url` - A public URL to an image.

    ```js
    {
      operation: 'input',
      type: 'url',
      url: 'https://example.com/image.jpg',
    }
    ```

2. `gcs` - A Google Cloud Storage public link to an image.

    ```js
    {
      operation: 'input',
      type: 'gcs',
      source: 'https://firebasestorage.googleapis.com/v0/b/my-bucket.appspot.com/o/image.jpg',
    }
    ```

3. `create` - Create a new image by specifying options such as width, height, background color, etc.

    ```js
    {
      operation: 'input',
      type: 'create',
      width: 100,
      height: 100,
      background: '#000000',
    }
    ```

The extension also comes with a JavaScript utility library for simplifying the creation of operations:

```ts
import { builder } from '@invertase/image-processing-api';

const output = builder()
  .input({
    url: 'https://example.com/image.jpg',
  })
  .grayscale()
  .output({
    webp: true,
  });

const params = `?operations=${output.toEncodedJSONString()}`;
```

View the [official documentation](https://extensions.invertase.dev/image-processing-api) for full usage examples.

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Storage bucket](https://firebase.google.com/docs/storage) in your Firebase project.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
  - Cloud Storage
