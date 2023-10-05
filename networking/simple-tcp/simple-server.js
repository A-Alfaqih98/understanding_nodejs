const net = require('net');
// http is build on top of net module, net module is the lowest level in nodejs

const server = net.createServer((socket) => {
  // socket is a duplex stream.
  // This is a tcp application.
  socket.on('data', (data) => {
    console.log(data);
  });
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running on port: ' + server.address().port);
});
