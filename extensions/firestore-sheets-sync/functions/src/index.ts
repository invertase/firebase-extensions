import * as functions from 'firebase-functions';
import { GaxiosError } from 'gaxios';
import { google, sheets_v4 } from 'googleapis';

import config from './config';

const sheets = google.sheets('v4');
const authClient = google.auth.getClient({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const googleSheetDeleteSync = functions.firestore
  .document(`${config.collection}`)
  .onDelete(async snapshot => {
    const data = snapshot.data();
    if (!data) return;

    const existingMetadata = await sheets.spreadsheets.developerMetadata.search(
      {
        auth: await authClient,
        spreadsheetId: config.spreadsheetId,
        requestBody: {
          dataFilters: [
            {
              developerMetadataLookup: {
                metadataKey: 'docId',
                metadataValue: snapshot.id,
                locationType: 'ROW',
              },
            },
          ],
        },
      },
    );

    console.log(JSON.stringify(existingMetadata.data));

    try {
      await sheets.spreadsheets.batchUpdate({
        auth: await authClient,
        spreadsheetId: config.spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  dimension: 'ROWS',
                  sheetId:
                    existingMetadata.data.matchedDeveloperMetadata![0]
                      .developerMetadata!.location!.dimensionRange!.sheetId,
                  startIndex:
                    existingMetadata.data.matchedDeveloperMetadata![0]
                      .developerMetadata?.location?.dimensionRange
                      ?.startIndex ?? 0,
                  endIndex:
                    existingMetadata.data.matchedDeveloperMetadata![0]
                      .developerMetadata?.location?.dimensionRange?.endIndex ??
                    0,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      functions.logger.error((error as GaxiosError).message, error);
    }
  });

export const googleSheetCreateSync = functions.firestore
  .document(`${config.collection}`)
  .onCreate(async snapshot => {
    const data = snapshot.data();

    if (!data) return;

    await createHeaderRow();

    const rows: sheets_v4.Schema$CellData[] = [];

    for (const field of config.fields) {
      const value = data[field];
      if (value) rows.push({ userEnteredValue: { stringValue: value } });
      else rows.push({ userEnteredValue: { stringValue: '' } });
    }

    try {
      // Append the new data to the Google Sheet.
      await appendNewRow({ values: rows, docId: snapshot.id });
    } catch (error) {
      functions.logger.error((error as GaxiosError).message, error);
    }
  });

export const googleSheetUpdateSync = functions.firestore
  .document(`${config.collection}`)
  .onUpdate(async change => {
    // Get the document that was written to Firestore, and structure it.
    const data = change.after.data();

    if (!data) return;

    await createHeaderRow();

    const existingMetadata = await sheets.spreadsheets.developerMetadata.search(
      {
        auth: await authClient,
        spreadsheetId: config.spreadsheetId,
        requestBody: {
          dataFilters: [
            {
              developerMetadataLookup: {
                metadataKey: 'docId',
                metadataValue: change.after.id,
                locationType: 'ROW',
              },
            },
          ],
        },
      },
    );

    console.log(JSON.stringify(existingMetadata.data));

    const rows: sheets_v4.Schema$CellData[] = [];

    for (const field of config.fields) {
      const value = data[field];
      if (value) rows.push({ userEnteredValue: { stringValue: value } });
      else rows.push({ userEnteredValue: { stringValue: '' } });
    }

    try {
      // Append the data to the Google Sheet.
      await appendNewRow({
        values: rows,
        metadataId:
          existingMetadata.data.matchedDeveloperMetadata![0].developerMetadata!
            .metadataId ?? undefined,
      });
    } catch (error) {
      // Log an error if the data was not written to the Google Sheet.
      functions.logger.error((error as GaxiosError).message, error);
    }
  });

async function appendNewRow({
  values,
  metadataId,
  docId,
}: {
  values: sheets_v4.Schema$CellData[];
  metadataId?: number;
  docId?: string;
}) {
  if (metadataId) {
    return sheets.spreadsheets.values.batchUpdateByDataFilter({
      auth: await authClient,
      spreadsheetId: config.spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            majorDimension: 'ROWS',
            dataFilter: {
              developerMetadataLookup: {
                metadataKey: 'docId',
                metadataId: metadataId,
              },
            },
            values: [
              [...values.map(e => e.userEnteredValue?.stringValue ?? '')],
            ],
          },
        ],
      },
    });
  } else {
    const res = await sheets.spreadsheets.batchUpdate({
      auth: await authClient,
      spreadsheetId: config.spreadsheetId,
      requestBody: {
        includeSpreadsheetInResponse: true,
        responseIncludeGridData: true,
        requests: [
          {
            appendCells: {
              rows: [{ values }],
              fields: '*',
            },
          },
        ],
      },
    });

    let startIndex = 0;
    let endIndex = 0;

    res.data.updatedSpreadsheet?.sheets?.forEach(sheet => {
      sheet.data?.forEach(data => {
        console.log(JSON.stringify(data.rowMetadata));
        endIndex = data.rowData?.length ?? 0;
        startIndex = endIndex - 1;
      });
    });
    console.log(startIndex);
    console.log(endIndex);
    return sheets.spreadsheets.batchUpdate({
      auth: await authClient,
      spreadsheetId: config.spreadsheetId,
      requestBody: {
        requests: [
          {
            createDeveloperMetadata: {
              developerMetadata: {
                metadataKey: 'docId',
                metadataValue: docId,
                visibility: 'DOCUMENT',
                location: {
                  dimensionRange: {
                    sheetId:
                      res.data.updatedSpreadsheet?.sheets?.[0].properties
                        ?.sheetId,
                    dimension: 'ROWS',
                    startIndex: startIndex,
                    endIndex: endIndex,
                  },
                },
              },
            },
          },
        ],
      },
    });
  }
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

  const res = await sheets.spreadsheets.batchUpdate({
    auth: await authClient,
    spreadsheetId: config.spreadsheetId,
    requestBody: {
      includeSpreadsheetInResponse: true,
      responseIncludeGridData: true,
      requests: [
        ...(headerHasData
          ? [
              {
                insertDimension: {
                  range: {
                    dimension: 'ROWS',
                    startIndex: 0,
                    endIndex: 1,
                  },
                  inheritFromBefore: false,
                },
              },
            ]
          : []),
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
      ],
    },
  });

  res.data.replies?.forEach(reply => {
    reply.addNamedRange;
  });
}

function arrayEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;

  return (
    a.every(item => new Set(b).has(item)) &&
    b.every(item => new Set(a).has(item))
  );
}
