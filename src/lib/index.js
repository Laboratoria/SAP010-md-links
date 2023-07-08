const fs = require('fs');
const path = require('path');
const fetch = require('cross-fetch');


function mdlinks(file, options) {
    // Resolvendo o caminho absoluto do arquivo
  const filePath = path.resolve(file);
    // Verificando se o arquivo é um arquivo Markdown (.md)
  if (path.extname(file) === '.md') {
    return new Promise((resolve, reject) => {
      // Lendo o arquivo Markdown
      fs.readFile(filePath, 'utf8', (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // Encontrando os links no arquivo Markdown
          const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
          const links = [];
          let match;
          while ((match = regex.exec(data)) !== null) {
            const text = match[1];
            const href = match[2];
            const fileName = path.basename(filePath);
            links.push({ text, href, file: fileName });
          }
          // Verificando as opções para validar os links, se necessário
          if (options && options.validate) {
            validateLinks(links)
              .then((validatedLinks) => {
                 // Obtendo estatísticas dos links validados
                const statistics = statisticsLinks(validatedLinks);
                resolve({ links: validatedLinks, statistics });
              })
              .catch((error) => reject(error));
          } else {
            // Obtendo estatísticas dos links encontrados
            const statistics = statisticsLinks(links);
            resolve({ links, statistics });
          }
        }
      });
    });
  } else {
    console.log(`O ${file} não é um arquivo Markdown`);
    return Promise.resolve([]);
  }
}

function validateLink(url) {
  // Fazendo uma requisição HTTP para validar o link
  return fetch(url.href)
    .then((response) => ({
      ...url,
      status: response.status,
      ok: response.ok ? 'ok' : 'fail',
    }))
    .catch((error) => ({
      ...url,
      status: error,
      ok: 'fail',
    }));
}

function validateLinks(links) {
  // Validando todos os links encontrados
  const linkPromises = links.map((link) => validateLink(link));
  return Promise.all(linkPromises);
}

function statisticsLinks(links) {
  // Obtendo estatísticas dos links
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === 'fail').length;
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

module.exports = mdlinks;











