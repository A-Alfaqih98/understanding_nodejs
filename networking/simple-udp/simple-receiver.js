// To use udp in node we use the dgram module.
const { log } = require('console');
const dgram = require('dgram');

// udp is connectionless, meaning that the socket does need to connect to an end point, it can fire up by itself.
const receiver = dgram.createSocket('udp4');

// In udp we have message event instead of data event
// remoteInfo param holds the address, family, port, and size.
receiver.on('message', (message, remoteInfo) => {
  log(`Server got: ${message}`);
  log(`From: ${remoteInfo.address}:${remoteInfo.port}`);
});
// It is possible to listen twice on the same port if using different protocols (TCP, UDP)
receiver.bind({ address: '127.0.0.1', port: 3000 }, () => {
  log('Receiver listening on port:', receiver.address());
});
