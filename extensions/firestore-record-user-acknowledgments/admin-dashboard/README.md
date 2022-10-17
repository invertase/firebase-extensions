# Record User Acknowledgments - Admin Dashboard

This repository contains the source code for the Admin Dashboard for the Record User Acknowledgments extension. Use this to locally create and manage notices, and view notice acknowledgments.

## Installation

Clone this repository:

```bash
git clone git@github.com:invertase/firebase-extensions.git
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
PROJECT_ID=your-project-id
```

This project assumes that you have setup [Google Application Default Credentials](https://firebase.google.com/docs/admin/setup) on your machine (a `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a service account JSON file).

Run the application:

```
npm run dev
```

## Configuration

If you have a none default path for where notices are stored in Firestore (default is `notices`), you can configure this in the `.env` file, for example:

```bash
NOTICES_COLLECTION=app_notices
ACKNOWLEDGMENTS_COLLECTION=app_acknowledgments
```
