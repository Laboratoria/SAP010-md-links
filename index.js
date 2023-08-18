const path = require('path');
const fs = require('fs');
const { readFile } = require('fs/promises');

// markdowns: .md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text

function mdLinks(rota) {
  return new Promise((resolve, reject) => {
    if ((fs.existsSync(rota)) && (path.extname(rota) === '.md' || '.mkd' || '.mdwn' || '.mdown' || '.mdtxt' || '.mdtext' || '.markdown' || '.text')) {
      resolve(path.resolve(rota));
        readFile(rota, 'utf8', (err, data) => {
          if (err) throw err;
          console.log(data);
        })
    } else {
      reject(new Error('este arquivo não é um markdown'));
    }
  })
}

mdLinks('teste.text')
  .then(() => {
    console.log(path.resolve('teste.text'));
    readFile('teste.text', 'utf8')
      .then((texto) => {
        console.log({ texto });
      })
      .catch((error) => {
        throw error;
      })

  })
  .catch((error) => {
    console.log(new Error(error))
  })

// console.log(mdLinks('README.md'));

module.exports = mdLinks;