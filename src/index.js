const fs = require('fs');
const path = require('path');

function getLinksFromFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, fileContent) => {
      if (err) {
        reject(`Erro ao retornar arquivos: ${err}`);
      } else if (!path.endsWith('.md')) {
        reject('O caminho de entrada não corresponde a um arquivo .md');
      } else {
        const regex =
          /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]|\bwww\.[\w-]+\.[\w./?%&=~-]+)/gi;
        const strFiles = fileContent.toString();
        const links = strFiles.match(regex) || [];
        const regexText = /\[(.*?)\]/g;
        const linkText = strFiles.match(regexText) || [];

        const linksObject = links.map((link, index) => ({
          href: link,
          text: linkText[index].replace(/^\[|\]$/g, ''),
          file: path,
        }));

        resolve(linksObject);
      }
    });
  });
}

//  retorna a lista de arquivos md em um diretório

function readDirectory(path) {
  try {
    const fileList = fs.readdirSync(path);

    const filteredList = fileList.filter((file) => {
      return path.extname(file) === '.md';
    });

    filteredList.forEach((file) => {
      const filePath = path.join(path, file);
      getLinksFromFile(filePath);
    });
  } catch (err) {
    console.error('Erro ao ler diretórios', err);
  }
}

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (!err) {
        if (stats.isFile()) {
          resolve(getLinksFromFile(path));
        } else if (stats.isDirectory()) {
          resolve(readDirectory(path));
        }
      }
    });
  });
}

// retorna os links de um arquivo específico (como objetos)

module.exports = mdLinks;
