// About streams
const fs = require('fs/promises');
(async () => {
  const fileHandler = await fs.open('text.txt', 'w');
  const stream = fileHandler.createWriteStream();
  const buff1 = Buffer.alloc(2, 'a');
  const interanalBufferHasSpace1 = stream.write(buff1);

  // To know whether interanl buffer has space, we can check what does write returns
  console.log(interanalBufferHasSpace1); // true
  // To get stream internal buffer size
  console.log(stream.writableHighWaterMark); // 16384
  // To get stream current bytes lenght (both in internal buffer and back pressure bytes which is the accumilated data behind the stream)
  console.log(stream.writableLength); // 2

  // Now we fill the interanl buffer and see that write will return false
  const buff2 = Buffer.alloc(16382, 1);
  const internalBufferHasSpace2 = stream.write(buff2);
  console.log(stream.writableHighWaterMark); // 16384
  console.log(stream.writableLength); // 16384
  console.log(internalBufferHasSpace2); // false

  // In order to drain the internal buffer we listen to the drain event, which will be triggered whean the internal buffer is full:
  stream.on('drain', () => {
    console.log('Sream writable length is: ' + stream.writableLength);
  });

  // Closing the file will trigger the stream finish event
  // fileHandler.close()
})();
