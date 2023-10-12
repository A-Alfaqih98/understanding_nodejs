const net = require('net');
const fs = require('fs/promises');
const path = require('path');
const readline = require('readline/promises');

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};
console.log();
const socket = net.createConnection(
  { host: '::1', port: 3000, family: 6 },
  async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);

    socket.write(`fileName: ${fileName}-----`);

    const fileHandle = await fs.open(filePath, 'r');

    const fileStream = fileHandle.createReadStream({ highWaterMark: 16000 });
    const fileSize = (await fileHandle.stat()).size;

    let uploadPercentage = 0;
    let byteUploaded = 0;

    fileStream.on('data', async (data) => {
      if (!socket.write(data)) {
        console.log('Stream paused');
        fileStream.pause();
      }

      byteUploaded += data.length;
      let newPercentage = Math.floor((byteUploaded / fileSize) * 100);

      if (newPercentage !== uploadPercentage) {
        uploadPercentage = newPercentage;
        await moveCursor(0, -1);
        await clearLine(0);
        console.log(`Uploading... ${uploadPercentage}%`);
      }
    });

    socket.on('drain', () => {
      fileStream.resume();
    });

    fileStream.on('end', () => {
      console.log('This file was succefuly uploaded');
      fileHandle.close();
      socket.end();
    });
  },
);
