const path = require('path');
const fsPromise = require('fs').promises;
const fs = require('fs');
// const { readFile } = require('fs/promises');

// markdowns: .md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text

function mdLinks(rota) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(rota)) {
      reject(new Error('Este arquivo não existe'));
    }

    const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', 'text'];
    const fileExtension = path.extname(rota);

    if (!mdExtensions.includes(fileExtension)) {
      reject(new Error('O arquivo não é um arquivo markdown'));
    }

    fsPromise.readFile(rota, 'utf-8')
      .then((file) => {

        if (file.trim() === '') {
          reject(new Error('O arquivo está vazio'));
        }

        const regex = /\[([^\[]+)\]\((.*)\)/gim;

        const filePath = path.resolve(rota);

        const myMatch = file.match(regex);

        if (myMatch === null) {
          resolve('Nenhum link encontrado');
          return;
        }

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
        reject(error);
      })
  })
}

// function mdLinks(rota) {
//   return new Promise((resolve, reject) => {
//     if (fs.existsSync(rota)) {
//       if (path.extname(rota) === '.md' || '.mkd' || '.mdwn' || '.mdown' || '.mdtxt' || '.mdtext' || '.markdown' || '.text') {
//         readFile(rota, 'utf8')
//           .then((file) => {
//             const regex = /\[([^\[]+)\]\((.*)\)/gim;

//             const filePath = path.resolve(rota);

//             const myMatch = file.match(regex);

//             let array = [];

//             const singleMatch = /\[([^\[]+)\]\((.*)\)/;
//             for (var i = 0; i < myMatch.length; i++) {
//               var text = singleMatch.exec(myMatch[i])
//               array.push({ href: text[2], texto: text[1], file: filePath })
//               // resolve([ { href: text[2] }, { texto: text[1]}, { file: filePath}])
//             }
//             resolve(array);

//           })
//           .catch((error) => {
//             console.error(error.message);
//           })
//         }
//     } else {
//       reject(new Error('Este arquivo não existe'));
//     }
//   })
// }
// console.log(mdLinks('README.md'));

module.exports = mdLinks;
