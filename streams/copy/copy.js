const fs = require('fs/promises');
const { pipeline } = require('stream');

// Copy without stream while mimicing the stream way
// (async () => {
//   console.time('copy');
//   const srcFile = await fs.open('text.txt', 'r');
//   const destFile = await fs.open('text-copy.txt', 'w');

//   let bytesRead = 1;

//   while (bytesRead) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     // Removing zeros from buffer
//     if (bytesRead !== 16384) {
//       const indexOfnotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfnotFilled);
//       // Copy readResult buffer to newBuffer
//       readResult.buffer.copy(newBuffer);
//       await destFile.write(newBuffer);
//     } else {
//       await destFile.write(readResult.buffer);
//     }

//     if (!bytesRead) {
//       srcFile.close();
//       destFile.close();
//     }
//   }

//   console.timeEnd('copy'); // 42ms
// })();

// // Copy using pipe |
// (async () => {
//   console.time('copy');
//   const srcFile = await fs.open('text.txt', 'r');
//   const destFile = await fs.open('text-copy.txt', 'w');

//   const readStream = srcFile.createReadStream();
//   const writeStream = destFile.createWriteStream();

//   readStream.pipe(writeStream);

//   readStream.once('end', () => {
//     srcFile.close();
//     destFile.close();
//     console.timeEnd('copy'); // 27ms
//   });
// })();

// Copy using pipe |
(async () => {
  console.time('copy');
  const srcFile = await fs.open('text.txt', 'r');
  const destFile = await fs.open('text-copy.txt', 'w');

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();
  // Stream pipe method has poor error handling and cleaning up, thus it is recomended to use pipeline method instead. Also, it provides callback when eht pipeline is complete.

  // When streams are finished succesfully they get destroyed, otherwise we will need to destroy them ourselves to prevent memory leaks issues.

  // After after the source stream argument, we can list more than one chaining dest streams to pipe the result to. The stream in the middle of first source and last desenation, can be either duplex or transform, since the have two Interanl buffers, readable and wriatable.
  pipeline(readStream, writeStream, (err) => {
    if (err) {
      console.log(err);
    }

    srcFile.close();
    destFile.close();

    // remove the dangling event listeners if any:
    // readStream.removeAllListeners();
    // writeStream.removeAllListeners();
    console.timeEnd('copy'); // 30ms
  });

  // stream.finished function also destroy streams and clean up.
})();
