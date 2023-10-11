const net = require('net');
const fs = require('fs/promises');

const server = net.createServer((_socket) => {});
let fileHandle, fileStream;

server.on('connection', async (socket) => {
  console.log('New connection');

  socket.on('data', async (data) => {
    if (!fileHandle) {
      socket.pause();
      fileHandle = await fs.open('./storage/test.txt', 'w');
      fileStream = fileHandle.createWriteStream();
      socket.resume();

      fileStream.write(data);

      fileStream.on('drain', () => {
        socket.resume();
      });
    } else {
      if (!fileStream.write(data)) {
        socket.pause();
      }
    }
  });

  socket.on('end', () => {
    fileHandle.close();
    fileHandle = undefined;
    fileStream = undefined;
    console.log('Connection ended');
  });
});

// Not specifying an ip address will default to zero which means the application will run on all interfaces.
server.listen(3000, '::', () => {
  console.log('server running on:', server.address());
});
