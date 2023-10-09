const net = require('net');

const sockets = [];

const server = net.createServer((socket) => {
  sockets.push(socket);

  socket.on('end', () => {
    const i = sockets.indexOf(socket);
    sockets.slice(i, 1);
  });

  socket.on('data', (data) => {
    sockets.forEach((currSocket) => {
      if (currSocket !== socket) {
        currSocket.write(data);
      }
    });
  });
});
server.listen(3000);
