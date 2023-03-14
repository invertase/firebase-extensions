# Sync Firestore to Google Sheets

**Author**: Invertase (**[https://invertase.io](https://invertase.io)**)

**Description**: Export defined collection to a Google Sheet.

**Details**: Use this extension to sync Firestore documents to Google Sheets automatically.

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

**Configuration Parameters:**

- Google Sheet ID: What is the ID of the Google Sheet you want to export to?

- Firestore collection to record export metadata: What is the path to the collection that will be synced to your Google Sheet?

- Fields to sync: A list of comma-separated fields to sync to the Google Sheet. If left blank, no fields will be synced.

- Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

**Cloud Functions:**

- **googleSheetSync:** Listens for document changes in your specified Cloud Firestore collection, then exports the changes into a Google Sheet.

**APIs Used**:

- sheets.googleapis.com (Reason: Powers all Sheets tasks performed by the extension.)

**Access Required**:

This extension will operate with the following project IAM roles:

- datastore.owner (Reason: Allows the extension to export (user) data from Cloud Firestore.)
