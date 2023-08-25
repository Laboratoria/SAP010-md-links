const path = require('path');
const fsPromise = require('fs').promises;
const fs = require('fs');
const axios = require('axios');

function readFileContent(rota) {
  return fsPromise.readFile(rota, 'utf-8');
}

function validateLinks(href) {
  return axios.head(href)
    .then(response => {
      return {
        status: response.status,
        ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail'
      };
    })
    .catch(error => {
      return {
        status: error.response ? error.response.status : 404,
        ok: 'fail'
      };
    });
}

function mdLinks(rota, validate = false) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(rota)) {
      reject(new Error('Este arquivo não existe'));
    }

    const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', 'text'];
    const fileExtension = path.extname(rota);

    if (!mdExtensions.includes(fileExtension)) {
      reject(new Error('O arquivo não é um arquivo markdown'));
    }

    readFileContent(rota)
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
        for (let i = 0; i < myMatch.length; i++) {
          let text = singleMatch.exec(myMatch[i])
          let linkObj = { href: text[2], texto: text[1], file: filePath };

          if (validate) {
            validateLinks(text[2])
              .then(validation => {
                linkObj.status = validation.status;
                linkObj.ok = validation.ok;
                array.push(linkObj);

                if (array.length === myMatch.length) {
                  resolve(array);
                }
              })
          } else {
            array.push(linkObj);
            if (array.length === myMatch.length) {
              resolve(array);
            }
          }
        }
      })
      .catch((error) => {
        reject(error);
      })
  })
}

module.exports = { mdLinks, readFileContent, validateLinks };