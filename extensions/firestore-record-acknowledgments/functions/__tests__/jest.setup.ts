import path from 'path';

(async function () {
  require('dotenv').config({
    path: path.resolve(
      __dirname,
      '../../../_emulator/extensions/firestore-firestore-record-acknowledgments.env.local',
    ),
  });

  process.env.EXT_INSTANCE_ID = 'firestore-firestore-record-acknowledgments';
})();
