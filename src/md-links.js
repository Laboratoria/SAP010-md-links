const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

function extractLinks(markdown) {
  const links = [];
  const renderer = new marked.Renderer();

  renderer.link = (href, _title, text) => {
    links.push({ href, text });
  };

  marked(markdown, { renderer });

  return links;
}

function validateLink(link) {
  return new Promise((resolve) => {
    fetch(link.href)
      .then((response) => {
        link.status = response.status;
        link.ok = response.ok;
        resolve(link);
      })
      .catch(() => {
        link.status = 404;
        link.ok = false;
        resolve(link);
      });
  });
}

function fileMD(filePath) {
  const ext = path.extname(filePath);
  return ext === '.md';
}

function readAndExtractLinks(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const links = extractLinks(data);
      resolve(links);
    });
  });
}

function readDirectoryRecursive(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const filePromises = files.map((file) => {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
          return readDirectoryRecursive(filePath);
        } else if (fileMD(filePath)) {
          return readAndExtractLinks(filePath);
        }
        return null;
      });

      Promise.all(filePromises)
        .then((results) => {
          const allLinks = results.filter((links) => links !== null).flat();
          resolve(allLinks);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

function mdLinks(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);

    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.isDirectory()) {
        readDirectoryRecursive(absolutePath)
          .then((links) => {
            if (options.validate) {
              const promises = links.map((link) => validateLink(link));
              Promise.all(promises)
                .then((updatedLinks) => {
                  resolve(updatedLinks);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(links);
            }
          });
      } else if (fileMD(absolutePath)) {
        readAndExtractLinks(absolutePath)
          .then((links) => {
            if (options.validate) {
              const promises = links.map((link) => validateLink(link));
              Promise.all(promises)
                .then((updatedLinks) => {
                  resolve(updatedLinks);
                });
            } else {
              resolve(links);
            }
          });
      } else {
        reject(new Error('Caminho do arquivo inválido, a extensão precisa ser ".md"'));
      }
    });
  });
}

module.exports = { mdLinks };
