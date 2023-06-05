Use this extension to run inferences in a Firestore collection using the [Hugging Face inference API](https://huggingface.co/docs/api-inference).

When triggered by a write operation in a Firestore document, this extension performs a Natural Language Processing task on a specified field and updates the document with the results.

The extension supports both using Hugging Face [Hosted Inference API](https://huggingface.co/docs/api-inference) and [Inference Endpoints](https://huggingface.co/docs/inference-endpoints/index).

## Supported tasks

This extension **currently** supports all Natural Language Processing tasks that are supported by HuggingFace, [click here to see the full list of NLP tasks](https://huggingface.co/docs/api-inference).

# Billing

This extension uses other Firebase or Google Cloud Platform services which may have associated charges:

- Cloud Functions
- Cloud Firestore

When you use Firebase Extensions, you're only charged for the underlying resources that you use. A paid-tier billing plan is only required if the extension uses a service that requires a paid-tier plan, for example calling to a Google Cloud Platform API or making outbound network requests to non-Google services. All Firebase services offer a free tier of usage. [Learn more about Firebase billing.](https://firebase.google.com/pricing)
