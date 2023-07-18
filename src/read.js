const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const markdownLinkExtractor = require('markdown-link-extractor');

function readFile(file) {
  const isMd = path.extname(file) === '.md';
  if (!isMd) {
    const errorMessage = new Error('Arquivo sem a extensão .md');
    return Promise.reject(errorMessage);
  }
  return fs.promises.readFile(file, 'utf8').then((data) => {
    const links = markdownLinkExtractor(data);
    return {
      file,
      links: links.links,
    };
  });
}

function readDir(pathDir) {
  return new Promise((resolve) => {
    fs.promises.readdir(pathDir)
      .then((files) => {
        const reading = files.map((file) => {
          const filePath = path.resolve(pathDir, file);
          if (path.extname(filePath) !== '.md') {
            console.log(chalk.bgRed('Arquivo sem a extensão .md:'), filePath);
            return null;
          }
          return readFile(filePath);
        });

        const filteredReading = reading.filter(Boolean);
        return Promise.all(filteredReading).then((result) => {
          resolve(result);
        });
      });
  });
}

function read(pathFile) {
  return fs.promises.stat(pathFile)
    .then((statsObj) => {
      if (statsObj.isDirectory(pathFile)) {
        return readDir(pathFile);
      }
      return readFile(pathFile);
    });
}

module.exports = {
  readDir,
  readFile,
  read,
};
