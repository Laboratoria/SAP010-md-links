const fs = require('fs');

const filePath = './files/files.md';

function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, fileContent) => {
      if (err) {
        reject(`Erro ao ler o arquivo: ${err.message}`);
      } else {
        resolve(fileContent);
      }
    });
  });
}

function extractLinks(fileContent) {
  const regex = /\[([^[\]]+)\]\(((https:\/\/[^()\s]+)|\S+)?\)/g;
  const links = [];

  let match;
  while ((match = regex.exec(fileContent))) {
    const [, text, href] = match;
    if (href && href.startsWith('https://')) {
      const link = {
        href: href,
        text: text.replace(/[\r\n]+/g, '').trim(),
      };
      links.push(link);
    }
  }

  if (links.length === 0) {
    console.table('Nenhum link válido foi encontrado no arquivo.');
  } else {
    console.table('Links encontrados:');
    console.table(links);
  }
}

readFilePromise(filePath)
  .then(fileContent => extractLinks(fileContent))
  .catch(err => console.error(err));