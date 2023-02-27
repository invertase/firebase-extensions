Use this extension to sync Firestore documents to Google Sheets automatically.

This extension creates a Cloud Function named `googleSheetSync`, which will be triggered when a Firestore document is created in the specified collection.

#### Pre-requisites

You must create a Google Sheets document that you want to sync with Firestore.
The Google Sheet ID can be found in the URL of the document, for example:

```
https://docs.google.com/spreadsheets/d/1DDMVqIN4lasb8y2EEVQyTKrlcLPZVLpqHyK26P9VtdU/
```

The ID is the part after `/d/` and before the next `/`.

#### Additional setup

Before installing this extension, make sure that you've [set up a Cloud Storage bucket](https://firebase.google.com/docs/storage) in your Firebase project.

#### Billing

To install an extension, your project must be on the [Blaze (pay as you go) plan](https://firebase.google.com/pricing)

- You will be charged a small amount (typically around $0.01/month) for the Firebase resources required by this extension (even if it is not used).
- This extension uses other Firebase and Google Cloud Platform services, which have associated charges if you exceed the service’s no-cost tier:
  - Cloud Storage
  - Cloud Functions (Node.js 10+ runtime. [See FAQs](https://firebase.google.com/support/faq#extensions-pricing))
