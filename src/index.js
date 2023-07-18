const fs = require('fs');
const path = require('path')


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

        const linkObjects = links.map((link, index) => ({
          href: link,
          text: linkText[index],
          file: path,
        }));

        resolve(linkObjects);
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
