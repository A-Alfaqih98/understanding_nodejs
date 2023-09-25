// Async
// const fs = require('fs/promises');

// (async () => {
//   const iteration = 1000000;

//   console.time('writeMany');
//   const fileHandler = await fs.open('text.txt', 'w');
//   for (let i = 0; i < iteration; i++) {
//     await fileHandler.write(i + 1 + ' ');
//   }
//   fileHandler.close();
//   console.timeEnd('writeMany');
//   // Execution time is: 21.219s
//   // CPU usage: 18% accross all cores
//   // Memory uasage: 50mb
// })();

// Call back
// const fs = require('fs');
// const { buffer } = require('stream/consumers');

// (() => {
//   const iteration = 1000000;

//   console.time('writeMany');
//   fs.open('text.txt', 'w', (err, fileDescriptor) => {
//     for (let i = 0; i < iteration; i++) {
//       fs.write(fileDescriptor, i + 1 + ' ', () => {});
//     }
//   });

//   console.timeEnd('writeMany');
//   // Execution time is: 1.232ms
//   // CPU usage: 17% accross all cores
//   // Memory uasage: 600mb
// })();

// Sync
// const fs = require('fs');

// (() => {
//   const iteration = 1000000;

//   console.time('writeMany');
//   const fileHandle = fs.open('text.txt', 'w', (_err, fileDescriptor) => {
//     for (let i = 0; i < iteration; i++) {
//       const buff = Buffer.from(i + 1 + ' ');
//       fs.writeSync(fileDescriptor, buff);
//     }
//     fs.close(fileDescriptor);
//   });
//   console.timeEnd('writeMany');
//   // Execution time is: 0.969ms
//   // CPU usage: 0%
//   // Memory uasage: 21mb
// })();

// Stream  (Not good example for using streams, as the memory usage is high in this example, because there are too many data buffered waiting to be pushed to the interanal buffer after it's drained)
// const fs = require('fs/promises');
// const { buffer } = require('stream/consumers');

// (async () => {
//   const iteration = 1000000;

//   console.time('writeMany');
//   const fileHandler = await fs.open('text.txt', 'w');

//   const stream = fileHandler.createWriteStream();
//   for (let i = 0; i < iteration; i++) {
//     const buff = Buffer.from(i + 1 + ' ');
//     // stream.write() method pushed to the internal buffer
//     stream.write(buff);
//   }

//   fileHandler.close();

//   console.timeEnd('writeMany');
//   // Execution time is: 425ms
//   // CPU usage: 0%
//   // Memory uasage: 230mb
//   //Note: Streams should be faster but, something is wrong here
// })();

// Stream  (The correct way)
const fs = require('fs/promises');

(async () => {
  console.time('writeMany');
  const fileHandler = await fs.open('text.txt', 'w');

  const stream = fileHandler.createWriteStream();

  let i = 0;

  const writeMany = () => {
    while (i < 1000000) {
      const buff = Buffer.from(` ${i} `, 'utf-8');
      if (i === 1000000 - 1) {
        // the end method will end the stream and emit finish event
        stream.end(buff);
        break;
      }
      if (!stream.write(buff)) break;
      i++;
    }
  };

  writeMany();

  stream.on('drain', () => {
    writeMany();
  });

  stream.on('finish', () => {
    console.timeEnd('writeMany');
    fileHandler.close();
  });

  // We can use propertey method NeedsDrain
  console.log(stream.writableNeedDrain);

  // Execution time is: 4.5s
  // CPU usage: 0%
  // Memory uasage: 37mb
})();
