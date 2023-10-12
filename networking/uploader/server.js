const net = require('net');
const fs = require('fs/promises');

const server = net.createServer((_socket) => {});

server.on('connection', async (socket) => {
  let fileHandle, fileStream;
  console.log('New connection');

  socket.on('data', async (data) => {
    if (!fileHandle) {
      socket.pause();
      const indexOfDeivider = data.indexOf('-----');
      const fileName = data.subarray(10, indexOfDeivider);

      fileHandle = await fs.open(`./storage/${fileName}`, 'w');
      fileStream = fileHandle.createWriteStream();
      socket.resume();

      fileStream.write(data.subarray(indexOfDeivider + 5));

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
    if (fileHandle) fileHandle.close();
    fileHandle = undefined;
    fileStream = undefined;
    console.log('Connection ended');
  });
});

// Not specifying an ip address will default to zero which means the application will run on all interfaces.
server.listen(3000, '::', () => {
  console.log('server running on:', server.address());
});
