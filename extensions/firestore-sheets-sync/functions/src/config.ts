export default {
  collection: process.env.FIRESTORE_COLLECTION,
  spreadsheetId: process.env.SHEET_ID,
  fields: Array.from(new Set(process.env.FIELDS_TO_SYNC!.split(','))),
};
