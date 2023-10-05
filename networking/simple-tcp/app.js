const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, '192.168.100.123', () => {
  console.log('Server running at http://localhost:3000');
});
