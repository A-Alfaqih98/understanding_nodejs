const fs = require('fs/promises');
const path = require('path');
(async () => {
  const files = await fs.readdir('./');
  console.log(files);
  files.forEach(async (file) => {
    if (file === 'move.js') return;
    await fs.rename(path.join(file), path.join('part1', file));
  });
})();
