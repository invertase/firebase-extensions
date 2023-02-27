import * as functions from 'firebase-functions';
import { GaxiosError } from 'gaxios';
import { google, sheets_v4 } from 'googleapis';

import config from './config';

const sheets = google.sheets('v4');
const authClient = google.auth.getClient({
  // keyFilename: 'extensions-testing-cae073db7903.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const fields = config.fields.split(',');

export const googleSheetSync = functions.firestore
  .document(`${config.collection}`)
  .onWrite(async change => {
    // Get the document that was written to Firestore, and structure it.
    const data = change.after.data();

    if (!data) return;

    await createHeaderRow();

    const rows: any[] = [];

    console.log(fields);

    for (const field of fields) {
      const value = data[field];
      if (value) rows.push(value);
      else rows.push('');
    }

    try {
      // Append the data to the Google Sheet.
      await appendNewRow(rows);

      return;
    } catch (error) {
      // Log an error if the data was not written to the Google Sheet.
      functions.logger.error((error as GaxiosError).message, error);
    }
  });

async function appendNewRow(data: any[]) {
  return sheets.spreadsheets.values.append({
    auth: await authClient,
    spreadsheetId: config.spreadsheetId,
    valueInputOption: 'RAW',
    requestBody: { values: [data], range: 'A2:Z2' },
    range: 'A2:Z2',
  });
}

async function createHeaderRow() {
  const values = fields.map<sheets_v4.Schema$CellData>(e => ({
    userEnteredValue: { stringValue: e as string },
    userEnteredFormat: {
      textFormat: {
        bold: true,
      },
    },
  }));

  const headerRow = await sheets.spreadsheets.values.get({
    auth: await authClient,
    spreadsheetId: config.spreadsheetId,
    range: 'A1:Z1',
    majorDimension: 'ROWS',
  });

  const headerValues = headerRow.data.values;

  // Check if the header row is already set up.
  if (
    headerValues &&
    headerValues?.length > 0 &&
    arrayEqual(headerValues[0].sort(), [...fields].sort())
  )
    return;

  const headerHasData = headerValues && headerValues.length > 0;

  await sheets.spreadsheets.batchUpdate({
    auth: await authClient,
    spreadsheetId: config.spreadsheetId,
    requestBody: {
      requests: [
        (headerHasData && {
          insertDimension: {
            range: {
              dimension: 'ROWS',
              startIndex: 0,
              endIndex: 1,
            },
            inheritFromBefore: false,
          },
        }) ||
          {},
        {
          updateSheetProperties: {
            properties: {
              gridProperties: { frozenRowCount: 1 },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        },
        {
          updateCells: {
            rows: [
              {
                values,
              },
            ],
            fields: '*',
            range: {
              startRowIndex: 0,
              endRowIndex: 1,
            },
          },
        },
      ].filter(Boolean),
    },
  });
}

function arrayEqual(arr1: any[], arr2: any[]) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return (
    arr1.every(item => set2.has(item)) && arr2.every(item => set1.has(item))
  );
}
