const path = require('path');
const fs = require('fs');
// .md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text
function mdLinks(rota) {
  return new Promise((resolve, reject) => {
    if ((fs.existsSync(rota)) && (path.extname(rota) === '.md' || '.mkd' || '.mdwn' || '.mdown' || '.mdtxt' || '.mdtext' || '.markdown' || '.text')) {
      resolve(path.resolve(rota));
    } else {
      reject(new Error('este arquivo não é um markdown'));
    }
  })
}

mdLinks('README.md')
  .then(() => {
    console.log(path.resolve('README.md'))
  })
  .catch((error) => {
    console.log(new Error(error))
  })

// console.log(mdLinks('README.md'));

module.exports = mdLinks;