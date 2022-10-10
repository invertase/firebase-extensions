### See it in action

You can test out this extension right away!

1. Create an operations list, for example:

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
```

2. Stringify and encode the list:

```js
encodeURIComponent(JSON.stringify(operations));
```

3. Call the deployed `process` Cloud Function:

[https://${param:LOCATION}-${param:PROJECT_ID}.cloudfunctions.net/ext-image-processing-api-handler/process?operations=%5B%7B%22operation%22%3A%22input%22%2C%22type%22%3A%22url%22%2C%22url%22%3A%22https%3A%2F%2Fimages.unsplash.com%2Fphoto-1663659552548-25d7771802c9%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26auto%3Dformat%26fit%3Dcrop%26w%3D774%26q%3D80%22%7D%2C%7B%22operation%22%3A%22grayscale%22%7D%2C%7B%22operation%22%3A%22output%22%2C%22format%22%3A%22webp%22%7D%5D](https://${param:LOCATION}-${param:PROJECT_ID}.cloudfunctions.net/ext-image-processing-api-handler/process?operations=%5B%7B%22operation%22%3A%22input%22%2C%22type%22%3A%22url%22%2C%22url%22%3A%22https%3A%2F%2Fimages.unsplash.com%2Fphoto-1663659552548-25d7771802c9%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26auto%3Dformat%26fit%3Dcrop%26w%3D774%26q%3D80%22%7D%2C%7B%22operation%22%3A%22grayscale%22%7D%2C%7B%22operation%22%3A%22output%22%2C%22format%22%3A%22webp%22%7D%5D)

The result will be a grayscaled version of the image, in WebP format.

### Using the extension

See the [official documentation](https://extensions.invertase.dev/image-processing-api) for more information on using the extension, including the full list of supported operations you can use.

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
