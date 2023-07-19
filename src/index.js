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
        const regex = /\[([^[\]]+)\]\(([^()\s]+|\S+)?\)/g;
        const strFiles = fileContent.toString();
        const links = [];

        let match;
        while ((match = regex.exec(strFiles))) {
          const [, text, href] = match;
          const link = {
            href: href || text, // Se href estiver vazio, use o texto como link
            text: text.trim(),
            file: path,
          };
          links.push(link);
        }

        resolve(links);
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
