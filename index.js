const fs = require('fs');
const path = require('path');
const pathInput = process.argv[2];

function mdLinks(pathInput) {
  return new Promise((resolve, reject) => {
    const fileCheck = fs.existsSync(pathInput);

    if (!fileCheck) {
      reject(new Error('O arquivo não existe'));
    } else {
      fs.stat(pathInput, (err, stats) => {
        if (!err) {
          if (stats.isFile()) {
            resolve(getLinksFromFile(pathInput));
          } else if (stats.isDirectory()) {
            resolve(readDirectory(pathInput));
          }
        }
      });
    }
  });
}

mdLinks(pathInput);

// retorna os links de um arquivo específico
function getLinksFromFile(pathInput) {
  fs.readFile(pathInput, (err, fileContent) => {
    if (err) {
      console.error('Erro ao retornar arquivos', err);
    } else if (!pathInput.endsWith('.md')) {
      console.error('O caminho de entrada não corresponde a um arquivo .md');
    } else {
      const regex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|\bwww\.[\w-]+\.[\w./?%&=~-]+)/gi;
      const strFiles = fileContent.toString();
      const links = strFiles.match(regex);
      if (links && links.length > 0) {
        links.forEach((link, index) => {
          console.log(`${index + 1}. href ${link}`);
        });
      } else {
        console.log('Nenhum link encontrado');
      }
    }
  });
}

//  retorna a lista de arquivos md em um diretório

function readDirectory(pathInput) {
  try {
    const fileList = fs.readdirSync(pathInput);

    const filteredList = fileList.filter((file) => {
      return path.extname(file) === '.md';
    });

    filteredList.forEach((file) => {
      const filePath = path.join(pathInput, file);
      //combina o input inicial, que é o caminho do diretório com o 'file' que é o nome do arquivo, resultando no path do arquivo
      getLinksFromFile(filePath);
    });
  } catch (err) {
    console.error('Erro ao ler diretórios', err);
  }
}

module.exports = mdLinks;
