const path = require('path');
const fsPromise = require('fs').promises;
const fs = require('fs');
const axios = require('axios');

function readMdFiles(rota) {
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
    const mdFiles = [];
    const subDir = [];

    dirContent.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const itemStats = fs.statSync(itemPath);

      if (itemStats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(itemPath))) {
        mdFiles.push(itemPath);
      } else if (itemStats.isDirectory()) {
         subDir.push(itemPath);
      }
    });

    const subMdFiles = subDir.flatMap(subdir => readMdFilesInDirectory(subdir));

    return [...mdFiles, ...subMdFiles];
  } catch (error) {
    console.log(error);
    return [];
  }
}

function readLinksInFile(fileContent, filePath, validate) {

  const regex = /\[([^\[]+)\]\((.*)\)/gim;

  const myMatch = fileContent.match(regex);

  if (myMatch === null) {
    throw new Error('Nenhum link encontrado no arquivo.');
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

function mdLinks(rota, options = { validate: false }) {
  const validate = options.validate;
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

      readMdFiles(rota)
        .then(file => readLinksInFile(file, rota, validate))
        .then(links => resolve(links))
        .catch((error) => {
          if (error.message === 'Nenhum link encontrado no arquivo.') {
            reject(new Error('O arquivo não contém links.'));
          }
        })
    } else {
      const mdFiles = readMdFilesInDirectory(rota);
      const allLinksPromises = mdFiles.map(file => {
        const filePath = path.join(file);
        return readMdFiles(filePath)
          .then(fileContent => readLinksInFile(fileContent, filePath, validate))
          .catch((error) => {
            if (error.message === "Nenhum link encontrado no arquivo.") {
              return [];
            } else {
              throw error;
            }
          })
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

module.exports = { mdLinks, readMdFiles, validateLinks, readMdFilesInDirectory, readLinksInFile };

// fazer uma função para ler arquivos md e chamar readFilecontent
// fazer uma função para ler diretórios e talvez chamar readFileContent