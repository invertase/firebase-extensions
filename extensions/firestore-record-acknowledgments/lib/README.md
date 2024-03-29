# Firestore Record Acknowledgements Utilities

To assist with the usage of this Extension, a [utility library](https://www.npmjs.com/package/@invertase/firestore-record-acknowledgements) exists
to help provide a typed API interface for easily constructing operations to send to the API.

## Installation

```bash
npm i --save @invertase/firestore-record-acknowledgements
```

> To use this library, you must also have the [`firebase`](https://www.npmjs.com/package/firebase) package installed and initialized before any usage.

## Usage

The library exports a number of functions to assist sending the correct payloads to the correct extension endpoints, with fully typed responses.
The user should be authenticated via the `firebase/auth` package before using any of the functions.

```ts
import { getNotice, acknowledgeNotice, unacknowledgeNotice, getAcknowledgments } from '@invertase/firestore-record-acknowledgements';

// ...

// Get a notice by ID (and optional version).
const notice = await getNotice({ type: 'banner', version: 2 });

// Acknowledge a notice by ID.
await acknowledgeNotice({ noticeId: '...', metadata: { ... } });

// Unacknowledge a notice by ID.
await unacknowledgeNotice({ noticeId: '...', metadata: { ... } });

// Get all acknowledgements for current user.
const acknowledgements = await getAcknowledgments({ includeUnacknowledgments: true });
```

## Custom Functions Instance

If you need to provide a custom functions instance, you can provide an instance to the `functions` argument. This
is useful if you wish to use a secondary app instance or change the region of the functions instance.

```ts
import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const app = initializeApp({ ... });
const functions = getFunctions(app, 'europe-west1');

// Use the custom functions instance.
const notice = await getNotice({ functions, type: 'banner' });
```

## Multiple Extension Instances

If you have multiple instances of the extension installed, you can provide the `extensionId` argument to the functions:

```ts
// Makes a request to the uniuque deployed extension.
const notice = await getNotice({ extensionId: '1234', type: 'banner' });
```
