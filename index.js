const path = require('path');
const fsPromise = require('fs').promises;
const fs = require('fs');
const axios = require('axios');

function readMdFiles(rota) { // função para ler arquivos md
  return fsPromise.readFile(rota, 'utf-8');
}

function validateLinks(href) { // função para status e ok da validação
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
  return fsPromise.readdir(dirPath)
    .then(dirContent => {
      const mdFiles = [];
      const subDir = [];

      const promises = dirContent.map(item => {
        const itemPath = path.join(dirPath, item);
        return fsPromise.stat(itemPath)
          .then(itemStats => {
            if (itemStats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(itemPath))) {
              mdFiles.push(itemPath);
            } else if (itemStats.isDirectory()) {
              subDir.push(itemPath);
            }
          });
      });

      return Promise.all(promises)
        .then(() => {
          const subPromises = subDir.map(subdir => readMdFilesInDirectory(subdir));
          return Promise.all(subPromises)
            .then(subMdFilesArrays => {
              subMdFilesArrays.forEach(subMdFiles => mdFiles.push(...subMdFiles));
              return mdFiles;
            });
        });
    });
}

// function readMdFilesInDirectory(dirPath) {
//   return fsPromise.readdir(dirPath)
//     .then(dirContent => {
//       const mdFiles = [];
//       const subDir = [];

//       const promises = dirContent.map(item => {
//         const itemPath = path.join(dirPath, item);
//         return fsPromise.stat(itemPath)
//           .then(itemStats => {
//             if (itemStats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(itemPath))) {
//               mdFiles.push(itemPath);
//             } else if (itemStats.isDirectory()) {
//               subDir.push(itemPath);
//             }
//           });
//       });

//       return Promise.all(promises)
//         .then(() => {
//           console.log('subDir:', subDir);
//           const subPromises = subDir.map(subdir => readMdFilesInDirectory(subdir));
//           return Promise.all(subPromises)
//             .then(subMdFiles => {
//               console.log('mdFiles:', mdFiles);
//               return [...mdFiles, ...subMdFiles.flat()]
//             });
//         })
//         .catch(error => {
//           console.error('Error in Promise.all:', error);
//           return [];
//         });
//     })
//     .catch(error => error);
// }

function readLinksInFile(fileContent, filePath, validate) { // função para extrair links

  const regex = /\[([^\[]+)\]\((.*)\)/gim;

  const myMatch = fileContent.match(regex);

  if (!myMatch || myMatch.length === 0) {
    return Promise.resolve([]); // Retorna uma Promise vazia se não houver links
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

  return fsPromise.stat(rota)
    .then(stats => {

      if (stats.isFile()) {
        const fileExtension = path.extname(rota);
        const mdExtensions = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
        if (!mdExtensions.includes(fileExtension)) {
          throw new Error('O arquivo não é um arquivo markdown');
        }

        return readMdFiles(rota)
          .then(file => readLinksInFile(file, rota, validate));
      } else {
        return readMdFilesInDirectory(rota)
          .then(mdFiles => {
            console.log('mdFiles:', mdFiles);
            const allMdFiles = mdFiles.flat();
            if (allMdFiles.length === 0) {
              throw new Error('Nenhum arquivo md encontrado no diretório');
            }
            return Promise.all(allMdFiles.map(file => {
              return fsPromise.readFile(file, 'utf-8')
                .then(fileContent => ({ filePath: file, fileContent }));
            }));
          })
          .then(fileContents => {
            console.log('fileContents:', fileContents);
            return Promise.all(fileContents.map(({ filePath, fileContent }) => {
              const absolutePath = path.resolve(filePath);
              console.log('absolutePath:', absolutePath);
              return readLinksInFile(fileContent, absolutePath, validate);
            }));
          })
          .then(allLinks => {
            // console.log('allLinks:', allLinks);
            return [].concat(...allLinks);
          });
      }
    })
    .catch(error => {
      if (error.code === 'ENOENT') {
        throw new Error('Arquivo/diretório não encontrado');
      }
    });
}

module.exports = { mdLinks, readMdFiles, validateLinks, readMdFilesInDirectory, readLinksInFile };