import * as functions from "firebase-functions";
import config from "./config";

export const googleSheetSync = functions.firestore.document(`${config.collection}`).onWrite((change, context) => {
  console.log("Hello from Google Sheets Sync!");
});
