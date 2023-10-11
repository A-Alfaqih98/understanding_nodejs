const http = require('http');
const dns = require('dns/promises');

let port;
// port = '192.168.100.123';
port = '::1';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, port, () => {
  console.log('Server running at http://localhost:3000');
});

const IPAdressLookup = async () => {
  const IP = await dns.lookup('google.com', 4);
  console.log(IP);
};

IPAdressLookup();
