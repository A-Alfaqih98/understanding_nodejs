const fs = require('fs/promises');

(async () => {
  const commands = {
    createFile: 'create a file',
    deleteFile: 'delete a file',
    renameFile: 'rename a file',
    addToFile: 'add to a file',
  };

  const createFile = async (filePath) => {
    let existingFileHandle;
    try {
      existingFileHandle = await fs.open(filePath, 'r');
      console.log(`File ${filePath} already exists`);
      existingFileHandle.close();
    } catch (e) {
      console.log(filePath);
      const newFileHandle = await fs.open(filePath, 'w');
      console.log(`File ${filePath} created`);
      newFileHandle.close();
    }
  };

  const deleteFile = async (filePath) => {
    try {
      await fs.unlink(filePath);
      console.log(`${filePath} deleted`);
    } catch (err) {
      console.log(`${filePath} does not exist`);
    }
  };

  const renameFile = async (filePath, newFilePath) => {
    try {
      await fs.rename(filePath, newFilePath);
      console.log(`${filePath} renamed to ${newFilePath}`);
    } catch (err) {
      console.log(`${filePath} does not exist`);
    }
  };

  const addToFile = async (filePath, textToAdd) => {
    try {
      const fileHandler = await fs.open(filePath, 'a');
      fileHandler.write(textToAdd);
      console.log(`Data added to ${filePath}`);
    } catch (error) {
      console.log(`error adding data to ${filePath}: ${error}`);
    }
  };

  const commandFileHandler = await fs.open('./command.txt', 'r');

  commandFileHandler.on('change', async () => {
    //get the size of the file
    const stat = await commandFileHandler.stat();
    const buff = Buffer.alloc(stat.size);
    const offset = 0;
    const length = buff.length;
    const position = 0;

    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString('utf-8');

    const getFilePath = (command) => {
      const filePath = command
        .substring(commands.createFile.length)
        .replace(/\n/g, '')
        .replace(/\r/g, '')
        .replace(/ /g, '');
      return filePath;
    };

    const getArguments = (command) => {
      const arguments = command
        .substring(commands.createFile.length + 1)
        .split(' ')
        .map((argument) =>
          argument.replace(/\n/g, '').replace(/\r/g, '').replace(/ /g, ''),
        );

      return arguments;
    };

    if (command.includes(commands.createFile)) {
      const filePath = getFilePath(command);
      createFile(filePath);
    } else if (command.includes(commands.deleteFile)) {
      filePath = getFilePath(command);
      deleteFile(filePath);
    } else if (command.includes(commands.renameFile)) {
      const arguments = getArguments(command);
      const filePath = arguments[0];
      const newFilePath = arguments[1];
      renameFile(filePath, newFilePath);
    } else if (command.includes(commands.addToFile)) {
      const arguments = getArguments(command);
      const filePath = arguments.splice(0, 1)[0];
      const data = arguments.join(' ');
      addToFile(filePath, data);
    } else {
      console.log('Command not found');
    }
  });

  const watcher = fs.watch('./command.txt');

  for await (const event of watcher) {
    if (event.eventType === 'change') {
      commandFileHandler.emit('change');
    }
  }
})();
