const net = require('net');
const fs = require('fs/promises');

const socket = net.createConnection(
  { host: '::1', port: 3000, family: 6 },
  async () => {
    const filePath = './file.txt';

    const fileHandle = await fs.open(filePath, 'r');

    const fileStream = fileHandle.createReadStream({ highWaterMark: 16000 });

    fileStream.on('data', (data) => {
      if (!socket.write(data)) {
        console.log('Stream paused');
        fileStream.pause();
      }
    });

    socket.on('drain', () => {
      fileStream.resume();
    });

    fileStream.on('end', () => {
      fileHandle.close();
      socket.end();
    });
  },
);
