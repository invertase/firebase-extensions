/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default {
  collection: process.env.FIRESTORE_COLLECTION,
  spreadsheetId: process.env.SHEET_ID,
  fields: process.env.FIELDS_TO_SYNC!,
};
