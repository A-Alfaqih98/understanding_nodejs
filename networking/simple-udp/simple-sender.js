const { log } = require('console');
const dgram = require('dgram');

const sender = dgram.createSocket('udp4');

// The sender socket will be assign random port by the OS each time it fires up.
sender.send('This is a string', 3000, '127.0.0.1', (error, bytes) => {
  if (error) log(error);
  log(bytes);
});
