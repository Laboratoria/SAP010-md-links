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

mdLinks('teste.md')
  .then((rotaDoArquivo) => {
    readFile('teste.md', 'utf8')
      .then((arquivo) => {
        // var textRegex =  /^[[][\w ]+[.-_, *]+[\]]/gim;
        // var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const regex = /\[([^\[]+)\]\((.*)\)/gim;

        const myMatch = arquivo.match(regex);

        const singleMatch = /\[([^\[]+)\]\((.*)\)/
        for (var i = 0; i < myMatch.length; i++) {
          var text = singleMatch.exec(myMatch[i])
          console.log([ { href: text[2] }, { text: text[1]}, { file: rotaDoArquivo}])
        }

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