import { it, expect, beforeAll, afterAll } from 'vitest';
import { readFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

let server: ReturnType<typeof createServer>;
let port: number;

beforeAll(async () => {
  // Load a local test image that will be served by the mock server
  const imageBuffer = await readFile(
    path.join(__dirname, '../fixtures/test_image.png'),
  );

  // Start a lightweight HTTP server to serve the image
  server = createServer((req, res) => {
    // If the request is for the test image path, return it
    if (req.url === '/images/photo.jpg') {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(imageBuffer);
    } else {
      // Otherwise return 404 for any unknown path
      res.writeHead(404);
      res.end();
    }
  });

  // Bind the server to a random available port
  await new Promise<void>(resolve => {
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      port = address.port; // Save the port for later use in the test
      resolve();
    });
  });
});

afterAll(() => {
  // Clean up: close the mock server after tests run
  server.close();
});

it('should process a request with path input via emulator', async () => {
  // Define the operations chain, using 'path' type to trigger dynamic image fetch
  const operations = [
    { operation: 'input', type: 'path', path: `/images/photo.jpg` }, // <-- served by our mock server
    { operation: 'resize', width: 200, height: 150 },
    { operation: 'grayscale' },
    { operation: 'blur', sigma: 5 },
    { operation: 'output', format: 'jpeg' },
  ];

  // Encode operations into a query string parameter
  const operationsParam = encodeURIComponent(JSON.stringify(operations));

  // Target the local emulator endpoint
  const emulatorBaseUrl = `http://127.0.0.1:5001/dev-extensions-testing/europe-west2/ext-image-processing-api-handler/process`;
  const fullUrl = `${emulatorBaseUrl}?operations=${operationsParam}`;

  // Perform a real HTTP request to the emulator
  const response = await fetch(fullUrl, {
    headers: {
      // Trick the emulator into building a path input URL that hits our mock server
      host: `localhost:${port}`,
    },
  });

  // Verify the emulator successfully processed the image
  expect(response.status).toBe(200);

  // Read the resulting image buffer and confirm it's not empty
  const buffer = await response.buffer();
  expect(buffer.byteLength).toBeGreaterThan(0);
});
