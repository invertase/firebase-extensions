# Image Processing API

**Author**: Invertase (**[https://invertase.io](https://invertase.io)**)

**Description**: Use this extension to optimize and transform images via a powerful HTTP API with over 30 different image operations to enhance and manipulate your images.

**Details**: Use this extension to optimize and transform images via a powerful HTTP API with over 30 different image operations to enhance and manipulate your images.

This extension creates a Cloud Function named `process`, which can be called via a GET request, specifiying
the operations to perform via the `operations` query parameter, for example:

```js
const operations = [
  {
    operation: 'input',
    type: 'url',
    url: 'https://images.unsplash.com/photo-1663659552548-25d7771802c9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
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
  
**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Cloud Storage bucket for images: The Cloud Storage bucket for images from a `gcs` input type.

- Allowed CORS origins.: A comma delimited value of allowed CORS origins. Use the default of '\*' to allow all origins. This is useful to lockdown your API and only allow your own website to embed the images directly. Note this will not prevent non-browser requests from accessing your API.

**Cloud Functions:**

- **handler:** Serves a API accepting incoming HTTP requests.

**APIs Used**:

- storage-component.googleapis.com (Reason: Needed to use Cloud Storage)

**Access Required**:

This extension will operate with the following project IAM roles:

- storage.admin (Reason: Allows the extension to read images in Cloud Storage)
