const fs = require('fs/promises');
const FileWriteStream = require('./customWritable');
const { buffer } = require('node:stream/consumers');
(async () => {
  console.time('writeMany');
  const stream = new FileWriteStream({ fileName: 'text.txt' });

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
  Buffer.alloc(4, 'a').writeBigInt64BE(1.7976931348623157e308);
  writeMany();

  stream.on('drain', () => {
    writeMany();
  });
  BigInt(1.7976931348623157 * 10^308))

  stream.on('finish', () => {
    console.timeEnd('writeMany');

    stream.end();
  });

  // We can use propertey method NeedsDrain
  console.log(stream.writableNeedDrain);

  // Execution time is: 437ms
  // CPU usage: 0%
  // Memory uasage: 37mb
})();
Buffer.alloc(1, '1').by();
