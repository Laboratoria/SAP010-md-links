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
        status: error.response ? error.response.status : 'N/A',
        ok: 'fail'
      };
    });
}

function readMdFilesInDirectory(dirPath) {
  try {
    const dirContent = fs.readdirSync(dirPath);
    const mdFiles = dirContent.filter(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      return stats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
    });
    return mdFiles;
  } catch (error) {
    console.log(error);
  }
}

function readAndValidateLinksInFile(fileContent, filePath, validate) {

  const regex = /\[([^\[]+)\]\((.*)\)/gim;

  const myMatch = fileContent.match(regex);

  if (myMatch === null) {
    return [];
  }

  const singleMatch = /\[([^\[]+)\]\((.*)\)/;

  const rota = path.resolve(filePath);

  const validateLinkPromises = myMatch.map(match => {
    const text = singleMatch.exec(match);
    const linkObj = { href: text[2], texto: text[1], file: rota };

    if (validate) {
      return validateLinks(text[2])
        .then(validation => {
          linkObj.status = validation.status;
          linkObj.ok = validation.ok;
          return linkObj;
        })
    } else {
      return Promise.resolve(linkObj);
    }
  });

  return Promise.all(validateLinkPromises);
}

function mdLinks(rota, validate = false) {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(rota)) {
      reject(new Error('Arquivo/diretório não encontrado'));
    }

    const stats = fs.statSync(rota);

    if (stats.isFile()) {
      const fileExtension = path.extname(rota);
      const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', 'text'];
      if (!mdExtensions.includes(fileExtension)) {
        reject(new Error('O arquivo não é um arquivo markdown'));
      }

      readFileContent(rota)
        .then(file => readAndValidateLinksInFile(file, rota, validate))
        .then(links => resolve(links))
        .catch((error) => {
          reject(error);
        })
    } else {
      const mdFiles = readMdFilesInDirectory(rota);
      const allLinksPromises = mdFiles.map(file => {
        const filePath = path.join(rota, file);
        return readFileContent(filePath)
          .then(fileContent => readAndValidateLinksInFile(fileContent, filePath, validate))
      })
      Promise.all(allLinksPromises)
        .then((allLinks) => {
          resolve(allLinks.flat());
        })
        .catch((error) => {
          reject(error);
        })
    }
  })
}

module.exports = { mdLinks, readFileContent, validateLinks, readMdFilesInDirectory, readAndValidateLinksInFile };

// fazer uma função para ler arquivos md e chamar readFilecontent
// fazer uma função para ler diretórios e talvez chamar readFileContent