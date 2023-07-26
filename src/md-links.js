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
        reject(new Error('Erro ao ler o arquivo.'));
        return;
      }

      const links = extractLinks(data);
      resolve(links);
    });
  });
}

function readDir(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath, { withFileTypes: true });

    const filePromises = files.map((file) => {
      const filePath = path.join(directoryPath, file.name);
      if (file.isDirectory()) {
        return readDir(filePath);
      } else if (fileMD(filePath)) {
        return readAndExtractLinks(filePath);
      }
      return null;
    });

    const results = Promise.all(filePromises).then((allLinks) => {
      return allLinks.filter((links) => links !== null).flat();
    });

    return results;
  } catch (err) {
    return Promise.reject(new Error('Erro ao ler o diretório.'));
  }
}

function mdLinks(filePath) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);

    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.isDirectory()) {
        readDir(absolutePath)
          .then((links) => {
            resolve(links);
          })
          .catch((error) => {
            reject(error);
          });
      } else if (fileMD(absolutePath)) {
        readAndExtractLinks(absolutePath)
          .then((links) => {
            resolve(links);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('Caminho do arquivo inválido, a extensão precisa ser ".md"'));
      }
    });
  });
}

module.exports = {
  validateLink,
  fileMD,
  readAndExtractLinks,
  readDir,
  mdLinks,
};
