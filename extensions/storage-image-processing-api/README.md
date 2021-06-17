# Image Processing API

**Author**: Invertase (**[https://invertase.io](https://invertase.io)**)

**Description**: TODO

**Configuration Parameters:**

- Cloud Functions location: Where do you want to deploy the functions created for this extension? You usually want a location close to your Storage bucket. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

- Cloud Storage bucket for images: The Cloud Storage bucket where images that are to be processed are located. API requests with input urls or paths that are not inside this bucket will be dropped.

- Allowed CORS origins.: A comma delimited value of allowed CORS origins. Use the default of '\*' to allow all origins. This is useful to lockdown your API and only allow your own website to embed the images directly. Note this will not prevent non-browser requests from accessing your API.

- Cloud Storage path where processed images will be cached.: A relative path in which to store cached images. For example, `cache`. If you prefer to store resized images at the default location, leave this field empty.

**Cloud Functions:**

- **api:** TODO

**APIs Used**:

- storage-component.googleapis.com (Reason: Needed to use Cloud Storage)

**Access Required**:

This extension will operate with the following project IAM roles:

- storage.admin (Reason: Allows the extension to store resized images in Cloud Storage)
