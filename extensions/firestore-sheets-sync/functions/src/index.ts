import * as functions from 'firebase-functions';
import { GaxiosError } from 'gaxios';
import { google, sheets_v4 } from 'googleapis';

import config from './config';

const sheets = google.sheets('v4');
const authClient = google.auth.getClient({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const googleSheetSync = functions.firestore
  .document(`${config.collection}`)
  .onWrite(async change => {
    // Get the document that was written to Firestore, and structure it.
    const data = change.after.data();

    if (!data) return;

    await createHeaderRow();

    const rows: any[] = [];

    for (const field of config.fields) {
      const value = data[field];
      if (value) rows.push(value);
      else rows.push('');
    }

    try {
      // Append the data to the Google Sheet.
      await appendNewRow(rows);
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
    requestBody: { values: [data] },
    range: '2:2',
  });
}

async function createHeaderRow() {
  const values = config.fields.map<sheets_v4.Schema$CellData>(e => ({
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
    range: '1:1',
    majorDimension: 'ROWS',
  });

  const headerValues = headerRow.data.values;

  // Check if the header row is already set up.
  if (
    headerValues &&
    headerValues?.length > 0 &&
    arrayEqual(headerValues[0].sort(), [...config.fields].sort())
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

function arrayEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;

  return (
    a.every(item => new Set(b).has(item)) &&
    b.every(item => new Set(a).has(item))
  );
}
