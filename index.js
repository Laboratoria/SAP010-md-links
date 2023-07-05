const fs = require('fs');
const path = require('path');

function mdlinks(file) {
  if (path.extname(file) === '.md') {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
          const links = [];
          let match;
          while ((match = regex.exec(data)) !== null) {
            const text = match[1];
            const href = match[2];
            links.push({text, href, file});
          }
            console.log(links)
            resolve(links);
          }
      });
    });
  } else {
    console.log(`O ${file} não é um arquivo Markdown`);
    return Promise.resolve([]);
  }
}

module.exports = mdlinks;




