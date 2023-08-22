const path = require('path');
const fs = require('fs');
const { readFile } = require('fs/promises');

// markdowns: .md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text

function mdLinks(rota) {
  return new Promise((resolve, reject) => {
    if ((fs.existsSync(rota)) && (path.extname(rota) === '.md' || '.mkd' || '.mdwn' || '.mdown' || '.mdtxt' || '.mdtext' || '.markdown' || '.text')) {
      readFile(rota, 'utf8')
        .then((file) => {
          const regex = /\[([^\[]+)\]\((.*)\)/gim;

          const filePath = path.resolve(rota);

          const myMatch = file.match(regex);

          let array = [];

          const singleMatch = /\[([^\[]+)\]\((.*)\)/;
          for (var i = 0; i < myMatch.length; i++) {
            var text = singleMatch.exec(myMatch[i])
            array.push({ href: text[2], texto: text[1], file: filePath })
            // resolve([ { href: text[2] }, { texto: text[1]}, { file: filePath}])
          }
          resolve(array);

        })
        .catch((error) => {
          console.error(error.message);
        })
    } else {
      reject(new Error('este arquivo não é um markdown'));

    }
  })
}
// console.log(mdLinks('README.md'));

module.exports = mdLinks;