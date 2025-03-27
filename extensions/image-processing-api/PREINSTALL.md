Image Processing Extension
Use this extension to optimize and transform images via a powerful HTTP API with over 30 image operations for enhancing and manipulating your images.

How It Works
When you install this extension, it deploys a Cloud Function that exposes an HTTP API. All requests must be sent to the /process endpoint of the function. You perform image operations by passing an operations query parameter—a URL-encoded JSON string defining the operations to execute.

Example
Define your operations like so:

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
Then, make your GET request to your Cloud Function using the correct endpoint. For example:

```
https://us-central1-<your-project-id>.cloudfunctions.net/<extension-instance-id>/process${params}
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
    format: 'webp',
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
  - Cloud Storage
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
