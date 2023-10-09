const net = require('net');
const uuid = require('uuid').v4;

const sockets = [];
// net uses TCP by default
const server = net.createServer((socket) => {
  const socketId = uuid();
  sockets.push({ socketId, socket });

  socket.on('end', () => {
    const socketIndex = sockets.findIndex((s) => s.socketId === socketId);
    sockets.splice(socketIndex, 1);
  });

  socket.on('data', (data) => {
    sockets.forEach((s) => {
      s.socket.write(socketId + ' > ' + data);
    });
  });
});

// Socket is one endpoint of a two-way communication link between two programs running on the network
// endpoint is a combination of an IP address and a port number.
server.on('connection', (socket) => {
  console.log('New Connection');
});

server.listen(3000, () => {
  console.log('opened server on:', server.address());
});
