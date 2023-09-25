// In node js there are three APIs to work with files provided by libuv
// 1- Asynchronous API
const fsPromises = require('fs/promises');
(async () => {
  try {
    await fsPromises.copyFile('./text.txt', './Asynchronous-API-copy.txt');
  } catch (err) {
    console.log(err);
  }
})();

// 2- Callback API
// const fs = require('fs');
// fs.copyFile('./text.txt', './Callback-API-copy.txt', (err) => {
//   if (err) console.log(err);
// });

// 3- Synchronous API
// const fs = require('fs');
// fs.copyFileSync('./text.txt', './Synchronous-API-copy.txt');
