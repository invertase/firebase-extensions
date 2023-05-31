# Trigger Hugging Face inference API from Firestore

**Author**: undefined 

**Description**: This extension triggers the Hugging Face inference API when  a new document is created in a Firestore collection.



**Details**: Use this extension to send a friendly greeting.

When triggered by an HTTP request, this extension responds with your specified friendly greeting.

<!-- We recommend keeping the following section to explain how billing for Firebase Extensions works -->
# Billing

This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

<!-- List all products the extension interacts with -->
- Cloud Functions

When you use Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)




**Configuration Parameters:**

* Hugging Face API Token: You can find your API token on your [Hugging Face account page](https://huggingface.co/settings/token).
From Hugging Face docs:
You should see a token hf_xxxxx (old tokens are api_XXXXXXXX or api_org_XXXXXXX).
If you do not submit your API token when sending requests to the API, you will not be able to run inference on your private models.

* Model ID: The Model ID from [Hugging Face Model Hub](https://huggingface.co/models).
Check the [recommended models for each ML task available](https://api-inference.huggingface.co/docs/python/html/detailed_parameters.html#detailed-parameters),  or the [Tasks](https://huggingface.co/tasks) overview.

* Inference Collection Name: New inferences using the HuggingFace Inference API can be made  by easily adding a new document to this collection.

* The task to run the inference on: The task to run the inference on. [Check more in the Hugging Face docs](https://huggingface.co/docs/api-inference/detailed_parameters),  or the [Tasks](https://huggingface.co/tasks) overview.



**Cloud Functions:**

* **runInference:** HTTP call-triggered function that run an inference on ${params:MODEL_ID}

* **triggerInference:** Firestore onCreate-triggered function that run an inference on ${params:MODEL_ID} when a new  document is created in the collection ${params:COLLECTION_NAME}



**Access Required**:



This extension will operate with the following project IAM roles:

* datastore.user (Reason: This role is required to read/write from the Cloud Firestore database.)
