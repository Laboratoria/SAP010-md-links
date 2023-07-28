const fs = require("fs");
const path = require("path");


function lerArquivos(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return reject(`Erro na leitura do arquivo: ${err}`);
      }
      const linkRegex = /\[([^[\]]+?)\]\((https?:\/\/[^\s?#.]+\S+?)\)/gm;

      let match;
      const darMatch = [];
      while ((match = linkRegex.exec(data)) !== null) {
        darMatch.push(match);
      }

      const linksEncontrados = darMatch.map((match) => ({
        text: match[1],
        url: match[2],
        file: path,
      }));

      //console.log(linksEncontrados);
      resolve(linksEncontrados);
    });
  });
}

/* Apagar depois que tiver CLI pronta & os console.log
const caminhoDoArquivo = path.join(__dirname, "arquivos", "arquivo.md");
lerArquivos(caminhoDoArquivo);*/

function lerDiretorioMd(diretorio) {
  return new Promise((resolve, reject) => {
    fs.readdir(diretorio, (err, data) => {
      if (err) {
        console.error(err);
        return reject(`Erro ao ler o diretório: ${err}`);
      }

      const listaArquivosMd = data
        .filter((data) => data.endsWith(".md"))
        .map((data) => lerArquivos(path.join(diretorio, data)));

      //console.log(listaArquivosMd);
      resolve(listaArquivosMd);
    });
  });
}

/*const caminhoDoDiretorio = path.join(__dirname, "arquivos");
lerDiretorioMd(caminhoDoDiretorio);*/
function validateLinks(arrayLinks) {
  return Promise.all(
      arrayLinks.map((link) => {
          return fetch(link.url)
              .then((response) => {
                  return {
                    ...link,
                    status : response.status, 
                    ok: response.ok ? 'ok' : 'fail'
                  };
              })
              .catch(() => {
                  return {
                    ...link,
                    status : 404, 
                    ok: 'fail'
                  };
              });
      })
  );
}


function getStats(links) {
  const totalLinks = links.length;
  const uniqueLinks = Array.from(new Set(links.map((link) => link.url))).length;
  return { totalLinks, uniqueLinks };
}

function mdLinks(path, options) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        return reject(`Erro: ${err}`);
      } else if (stats.isFile()) {
        lerArquivos(path)
          .then((links) => {
            if (options && options.validate) {
              return validateLinks(links)
                .then((validatedLinks) => {
                  const statsResult = getStats(validatedLinks);
                  const totalBrokenLinks = validatedLinks.filter((link) => link.ok === "fail").length;
                  resolve({ links: validatedLinks, stats: { ...statsResult, totalBrokenLinks } });
                });
            }
            return { links, stats: getStats(links) };
          })
          .then(({ links, stats }) => {
            if (options && options.stats) {
              resolve({ ...stats, totalBrokenLinks: 0 });
            } else {
              resolve(links);
            }
          })
          .catch(reject);
      } else if (stats.isDirectory()) {
        lerDiretorioMd(path)
          .then((linksArray) => {
            const links = linksArray.flat();
            if (options && options.validate) {
              return validateLinks(links)
                .then((validatedLinks) => {
                  const statsResult = getStats(validatedLinks);
                  const totalBrokenLinks = validatedLinks.filter((link) => link.ok === "fail").length;
                  resolve({ links: validatedLinks, stats: { ...statsResult, totalBrokenLinks } });
                });
            }
            return { links, stats: getStats(links) };
          })
          .then(({ links, stats }) => {
            if (options && options.stats) {
              resolve({ ...stats, totalBrokenLinks: 0 });
            } else if (options && options.validate) {
              resolve(links);
            } else {
              resolve(links);
            }
          })
          .catch(reject);
      }
    });
  });
}

module.exports = { mdLinks };