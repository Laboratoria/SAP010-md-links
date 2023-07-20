const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

function extractLinks(markdown) {
  const links = [];
  const renderer = new marked.Renderer();

  renderer.link = (href, _title, text) => {
    links.push({ href, text });
  };

  marked(markdown, { renderer });

  return links;
}

function validateLink(link) {
  return new Promise((resolve, reject) => {
    fetch(link.href)
      .then((response) => {
        link.status = response.status;
        link.ok = response.ok;
        resolve(link);
      })
      .catch(() => {
        link.status = 404; // Marcando o status como 404 (Not Found) para link quebrado
        link.ok = false; // Marcando como não ok (false)
        resolve(link);
        reject(new Error('Error, link quebrado'));
      });
  });
}

function fileMD(filePath) {
  const ext = path.extname(filePath);
  return ext === '.md';
}

function mdLinks(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    if (!fileMD(filePath)) {
      reject(new Error('Caminho do arquivo invalido, a extensão precisa ser ".m" '));
      return;
    }
    const absolutePath = path.resolve(filePath);

    fs.readFile(absolutePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const links = extractLinks(data);

      if (options.validate) {
        const promises = links.map((link) => validateLink(link));
        Promise.all(promises)
          .then((updatedLinks) => {
            resolve(updatedLinks);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        resolve(links);
      }
    });
  });
}

module.exports = { mdLinks };

/* mdLinks('./src/file/file.md')
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error.message);
  });

mdLinks('./src/file/file.md', { validate: true })
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error.message);
  });

mdLinks('./src/file', { validate: true })
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error.message);
  }); */

/* const { read } = require('./read.js');
const { validateFunction, getLinks } = require('./options.js');

function mdLinks(pathFile, option) {
  return new Promise((resolve, reject) => {
    read(pathFile)
      .then((fileContent) => {
        if (!Array.isArray(fileContent)) {
          getLinks(fileContent)
            .then((linksObj) => {
              if (!option.validate) {
                resolve(linksObj);
              } else {
                validateFunction(linksObj)
                  .then((arrayLinkFetchResolved) => {
                    resolve(arrayLinkFetchResolved);
                  })
                  .catch(reject);
              }
            })
            .catch(reject);
        } else {
          Promise.all(fileContent.map((objContent) => getLinks(objContent)))
            .then((linksObjArray) => {
              resolve(linksObjArray.flat());
            })
            .catch(reject);
        }
      })
      .catch(reject);
  });
}

module.exports = { mdLinks }; */
