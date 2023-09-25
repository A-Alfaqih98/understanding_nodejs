const { Buffer } = require('buffer');
// This is a global object that is available in Node.js
// but it is best practice to import it from the buffer module

const buff = Buffer.alloc(8);
// This creates a buffer of 8 bytes and fills it with zeros
console.log(buff);
// <Buffer 00 00 00 00 00 00 00 00>
buff.write('s', 'utf-8');
// This writes the string 's' to the buffer, if we try to write more characters than 8 bytes they will be ignored
console.log({ buff });
// <Buffer 73 00 00 00 00 00 00 00>
console.log({ buffuerToJson: buff.toJSON() });
console.log('buffer length: ' + buff.length);
console.log('first byte: ' + buff[0]);
console.log('fromCharCode: ' + String.fromCharCode(buff[0]));
console.log(
  'fromCodePoint: ' + String.fromCodePoint('0x' + buff[0].toString(16)),
);

const buff2 = Buffer.from('hello', 'utf-8');
console.log({ buff2 });

const buff3 = Buffer.from([115], 'utf-8');
console.log({ buff3: buff3.toJSON() });
console.log({ buff3: buff3.toString('utf-8') });
