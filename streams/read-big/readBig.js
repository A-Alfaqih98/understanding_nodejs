// const fs = require('fs/promises');
// (async () => {
//   const fileHandleRead = await fs.open('text.txt', 'r');
//   const fileHandleWrite = await fs.open('dest.txt', 'w');
//   const streamRead = fileHandleRead.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   // The default read stream internal buffer is : 64 kb = 64 * 1024,
//   //   console.log(stream.readableHighWaterMark); // 65536
//   const streamWrite = fileHandleWrite.createWriteStream();

//   streamRead.on('data', (chunk) => {
//     if (!streamWrite.write(chunk)) {
//       // We pause the read stream until the write stream is drained so we dont have backpressure(chunked buffered in memory)
//       streamRead.pause();
//     }
//   });

//   streamWrite.on('drain', () => {
//     streamRead.resume();
//   });
// })();

// Same as the above code but with writing only even numbers
// fs = require('fs/promises');
// (async () => {
//   console.time('readBig');
//   const fileHandleRead = await fs.open('text.txt', 'r');
//   const fileHandleWrite = await fs.open('dest.txt', 'w');
//   const streamRead = fileHandleRead.createReadStream({
//     highWaterMark: 64 * 1024,
//   });
//   // The default read stream internal buffer is : 64 kb = 64 * 1024,
//   //   console.log(stream.readableHighWaterMark); // 65536
//   const streamWrite = fileHandleWrite.createWriteStream();

//   let split = '';
//   streamRead.on('data', (chunk) => {
//     const numbers = chunk.toString('utf-8').split('  ');
//     if (split) {
//       numbers[0] = split.trim() + numbers[0].trim();
//       split = '';
//     }

//     if (
//       Number(numbers[numbers.length - 1]) -
//         Number(numbers[numbers.length - 2]) !==
//       1
//     ) {
//       split = numbers.pop();
//     }

//     numbers.forEach((number) => {
//       if (Number(number) % 2 === 0) {
//         if (!streamWrite.write(' ' + Number(number)) + ' ') {
//           // We pause the read stream until the write stream is drained so we dont have backpressure(chunked buffered in memory)
//           streamRead.pause();
//         }
//       }
//     });
//   });

//   streamWrite.on('drain', () => {
//     streamRead.resume();
//   });

//   streamRead.on('end', () => {
//     console.log('Done Reading');
//     console.timeEnd('readBig');
//   });
// })();

//  Readable Event: https://stackoverflow.com/questions/26174308/what-are-the-differences-between-readable-and-data-event-of-process-stdin-stream#:~:text=The%20'data'%20example%20calls%20your,read%20it%20at%20any%20time.
fs = require('fs/promises');
(async () => {
  console.time('readBig');
  const fileHandleRead = await fs.open('text.txt', 'r');
  const fileHandleWrite = await fs.open('dest.txt', 'w');
  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  // The default read stream internal buffer is : 64 kb = 64 * 1024,
  //   console.log(stream.readableHighWaterMark); // 65536
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = '';
  streamRead.on('readable', () => {
    // In this event we cannot pause flow of data, rather we will be notified through this event if there is data to read and we chose to read it or wait, any data that is not read yet will be buffered in memory
    const buff = streamRead.read();

    if (buff) {
      streamWrite.write(buff);
    }
  });

  streamRead.on('end', () => {
    console.log('Done Reading');
    console.timeEnd('readBig');
    fileHandleRead.close();
    fileHandleWrite.close();
  });
})();
