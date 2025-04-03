# Image Processing API

**Author**: Invertase (**[https://invertase.io](https://invertase.io)**)

**Description**: Use this extension to optimize and transform images via a powerful HTTP API with over 30 different image operations to enhance and manipulate your images.

**Details**: # Image Processing Extension
Use this extension to optimize and transform images via a powerful HTTP API with over 30 image operations for enhancing and manipulating your images.

## How It Works

When you install this extension, it deploys a Cloud Function that exposes an HTTP API. All requests must be sent to the /process endpoint of the function. You perform image operations by passing an operations query parameter—a URL-encoded JSON string defining the operations to execute.

### Example

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
https://<your-configured-region>-<your-project-id>.cloudfunctions.net/<extension-instance-id>/process${params}
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

### Relative paths

The extension provides a hostname parameter, allowing you to query the function with local paths (starting with `/`).

As an example, if we set the hostname parameter to "example.com" then the following operation:

```js
const operations = [
  {
    operation: 'input',
    type: 'url',
    url: '/image.jpg',
  },
  {
    operation: 'grayscale',
  },
  {
    operation: 'output',
    format: 'webp',
  },
];
```

is equivalent to the earlier given example. The url `https://example.com/image.jpg` is constructed within the extension.

Note that this will **only** apply to paths that begin with a forward slash `/`, and **only** when the hostname parameter is set.

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Storage bucket](https://firebase.google.com/docs/storage) in your Firebase project.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Cloud Storage
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))

**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Cloud Storage bucket for images: The Cloud Storage bucket where images that are to be processed are located. API requests with input urls or paths that are not inside this bucket will be dropped.

- Allowed CORS origins: A comma delimited value of allowed CORS origins. Use the default of '\*' to allow all origins. This is useful to lockdown your API and only allow your own website to embed the images directly. Note this will not prevent non-browser requests from accessing your API.

- Hostname: An optional hostname to fetch images from. This can used to construct the original image URL in the response. Include ONLY the hostname, without any protocol or path. The protocol https:// will be added automatically. This parameter is needed if you would like to query using local path names such as /my/image.jpg. instead of the full URL.

**Cloud Functions:**

- **handler:** Serves a API accepting incoming HTTP requests.

**APIs Used**:

- storage-component.googleapis.com (Reason: Needed to use Cloud Storage)

**Access Required**:

This extension will operate with the following project IAM roles:

- storage.admin (Reason: Allows the extension to read images in Cloud Storage)
