
const fs = require('fs');
/* const fetch = require('node-fetch') */

// Função para extrair o texto do link
function extractLinks(text, filePath) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const links = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const linkText = match[1];
    const linkHref = match[2];
    const link = { href: linkHref, text: linkText, file: filePath };
    links.push(link);
  }

  return links;
}

// Função para validar os links
function validateLinks (links) {
  const promises = links.map((link) => {
    return fetch(link.href)
      .then((response) => {
        link.status = response.status;
        link.ok = response.ok ? 'OK' : 'FAIL';
        return link;
      })
      .catch(() => {
        link.status = 404;
        link.ok = 'FAIL';
        return link;
      });
  });

  return Promise.all(promises);
}
// Função para as estaticas dos links
function statsLinks(links) {
  const linksSize = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === 'FAIL').length;
  return {
    total: linksSize,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

function readRecursion(dirPath, fileCallback) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      const filePath = `${dirPath}/${file}`;

      fs.stat(filePath, (err, stats) => {
        if (err) {
          throw err;
        }

        if (stats.isDirectory()) {
          // Caso seja um diretório, chamama a função recursivamente
          readRecursion(filePath, fileCallback);
        } else if (stats.isFile() && file.endsWith('.md')) {
          // Caso seja um arquivo Markdown, chamamos a função de callback
          fileCallback(filePath);
        }
      });
    });
  });
}

function fileRead(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        // ENOENT - um arquivo ou diretório que não existe no sistema de arquivos.
        if (err.code === 'ENOENT') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`O arquivo ${filePath} não foi encontrado.`);
        } else {
          reject(err);
        }
      } else {
        if (stats.isDirectory()) {
          const markdownFiles = [];
          readRecursion(filePath, (file) => {
            if (file.endsWith('.md')) {
              markdownFiles.push(file);
            }
          });

          const promises = markdownFiles.map((file) => {
            return fs.promises
              .readFile(file, 'utf8')
              .then((data) => {
                const links = extractLinks(data, file);
                return validateLinks(links).then((validatedLinks) => {
                  const statistics = statsLinks(validatedLinks);
                  return { file, links: validatedLinks, stats: statistics };
                });
              })
              .catch((error) => {
                throw error;
              });
          });

          Promise.all(promises)
            .then((results) => {
              resolve(results);
            })
            .catch((error) => {
              reject(error);
            });
        } else if (stats.isFile() && filePath.endsWith('.md')) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              reject(err);
            } else {
              const links = extractLinks(data, filePath);
              validateLinks(links)
                .then((validatedLinks) => {
                  const statistics = statsLinks(validatedLinks);
                  resolve({ file: filePath, links: validatedLinks, stats: statistics });
                })
                .catch((error) => {
                  reject(error);
                });
            }
          });
        } else {
          reject(`O caminho ${filePath} não é um arquivo Markdown válido.`);
        }
      }
    });
  });
}

module.exports = {
  fileRead,
  validateLinks,
  statsLinks,
};
