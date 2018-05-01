import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const sandboxesPath = path.join(__dirname, '../../sandboxes');

const readFolderFiles = folderPath =>
  fs.readdirSync(folderPath).map(file => {
    const filePath = path.join(folderPath, file);

    return {
      name: file,
      content: fs.lstatSync(filePath).isDirectory()
        ? readFolderFiles(filePath)
        : fs.readFileSync(filePath, 'utf8'),
    };
  });

export default class FilesSandbox {
  static sandboxesPath = path.join(__dirname, '../../../sandboxes');

  constructor(prefix = 'sandbox-', sandboxesPath = FilesSandbox.sandboxesPath) {
    try {
      fs.mkdirSync(sandboxesPath);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }

    this.sandboxPath = fs.mkdtempSync(path.join(sandboxesPath, prefix));
  }

  readFiles() {
    return readFolderFiles(this.sandboxPath);
  }

  clean() {
    rimraf.sync(this.sandboxPath);
  }
}
