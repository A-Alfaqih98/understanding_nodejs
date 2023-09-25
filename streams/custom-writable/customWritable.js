const { Writable } = require('node:stream');
const fs = require('fs');

class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.numberOfWrites = 0;
  }

  // This will run after the costructor and will put off calling all the other methods until we call the call back function
  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) {
        // If we call the call back with an argument it means we have and error
        callback(err);
      } else {
        this.fd = fd;
        // No arguments means it was successful
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        ++this.numberOfWrites;
        callback();
      });
    } else {
      callback();
    }
  }

  // This method will be called when stream end method is used
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) {
        return callback(err);
      }

      this.chunks = [];
      this.chunkSize = 0;
    });

    // The call back is what emit the finish event
    callback();
  }

  _destroy(error, callback) {
    console.log('Number of writes:', this.numberOfWrites);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

module.exports = FileWriteStream;

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: 'text-copy.txt',
});
stream.write(Buffer.from('this is some string'));
stream.end(Buffer.from('Our last write.'));

stream.on('drain', () => {});

stream.on('finish', () => {
  console.log('streaming finished');
});

/////////////////////////////////////////////////////////////////////
// class Parent {
//   constructor(name, familyName) {
//     this.age = 11;
//     this.name = name;
//     this.familyName = familyName;
//     this.fullParentName = name + ' ' + familyName;
//   }
// }

// class Child extends Parent {
//   constructor(childName, parentName, familyName) {
//     // super is used to invoke parent cosntructor
//     super(parentName, familyName);
//     this.childName = childName;
//     this.parentAge = this.age;
//   }
// }

// const child = new Child('mike', 'homer', 'simpson');

// console.log(child);
// // Child {
// //   name: 'homer',
// //   familyName: 'simpson',
// //   fullParentName: 'homer simpson',
// //   childName: 'mike'
// // }
