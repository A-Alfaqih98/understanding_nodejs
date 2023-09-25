const http = require('http');
const fs = require('fs/promises');

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    const contentBuffer = await fs.readFile('./text.txt');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(contentBuffer.toString('utf-8'));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
