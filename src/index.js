const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const markdownLinkExtractor = require('markdown-link-extractor');

function readFile(file) {
  const isMd = path.extname(file) === '.md';
  if (!isMd) {
    const errorMessage = new Error('O arquivo fornecido não é .md');
    return Promise.reject(errorMessage);
  }
  return fs.promises.readFile(file, 'utf8').then(data => {
    const links = markdownLinkExtractor(data);
    return {
      file: file,
      links: links.links
    };
  });
}

readFile('./src/file')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });

function readDir(pathDir) {
  return new Promise((resolve) => {
    fs.promises.readdir(pathDir)
      .then((files) => {
        const reading = files.filter(file => {
          return path.extname(file) === '.md';
        })
          .map(file => {
            return readFile(path.resolve(pathDir, file));
          });
        return Promise.all(reading).then((result) => {
          resolve(result);
        });
      })
      .catch((error) => {
        console.error(error);
        resolve([]);
      });
  });
}

readDir('./src/file')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });

module.exports = {
  readDir,
  readFile,
};