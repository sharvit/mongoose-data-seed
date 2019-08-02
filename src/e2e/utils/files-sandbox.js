import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { ncp } from 'ncp';

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

  copyFolderToSandbox(source) {
    return new Promise((resolve, reject) =>
      ncp(source, this.sandboxPath, err => {
        if (err) return reject(err);
        resolve();
      })
    );
  }

  readFiles() {
    return readFolderFiles(this.sandboxPath);
  }

  clean() {
    rimraf.sync(this.sandboxPath);
  }
}
