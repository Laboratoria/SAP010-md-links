const fs = require('fs');

const path = require('path');

//  const axios = require('axios');

const pathInput = process.argv[2];

/* a função mdLinks deve retornar uma array, em que cada item da array é um objeto
 cada objeto é um link encontrado no arquivo, e possui três keys:
 href, text, file recebe como parâmetro: o caminho e as opções selecionadas (validate e/ou stats)
 primeiro verifica se o path leva para um arquivo ou diretório
 se levar para um arquivo, resolve a promessa com getLinksFromFile
 se levar para um diretório, resolve com readDirectory
 a partir daí temos os links, as funções getLinksFromFile e readDirectory devem retornar
 cada link como um objeto dentro de uma array, com as keys

 link = {
  "href": www.oi.com,
  "text": ausdhas,
  "file": path
 }

 com validate
 link = {
  "href": www.oi.com,
  "text": ausdhas,
  "file": path,
  "status": resposta HTTP,
  "ok": fail/ok
 }

*/

function getLinksFromFile(pathInput) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathInput, (err, fileContent) => {
      if (err) {
        reject(`Erro ao retornar arquivos: ${err}`);
      } else if (!pathInput.endsWith('.md')) {
        reject('O caminho de entrada não corresponde a um arquivo .md');
      } else {
        const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]|\bwww\.[\w-]+\.[\w./?%&=~-]+)/gi;
        const strFiles = fileContent.toString();
        const links = strFiles.match(regex) || [];

        const regexText = /\[(.*?)\]/g;
        const linkText = strFiles.match(regexText) || [];

        const linkObjects = links.map((link, index) => ({
          href: link,
          text: linkText[index],
          file: pathInput,
        }));
        // trocar esse console para resolve depois (chamar o console no cli.js)
        linkObjects.forEach((link, index) => {
          console.log(`${index + 1}.`, link);
        });
      }
    });
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
      getLinksFromFile(filePath);
    });
  } catch (err) {
    console.error('Erro ao ler diretórios', err);
  }
}

function mdLinks() {
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

// retorna os links de um arquivo específico (como objetos)


module.exports = mdLinks;
