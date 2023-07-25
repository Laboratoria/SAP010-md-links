const fs = require('fs');
const path = require('path');
const marked = require('marked');
const fetch = require('node-fetch');

// Função que extrai os links de um arquivo Markdown.
function extractLinks(markdown) {
  const links = [];
  const renderer = new marked.Renderer();

  // Sobrescreve o método 'link' do renderer para capturar os links encontrados.
  renderer.link = (href, _title, text) => {
    links.push({ href, text });
  };

  // Converte o Markdown em HTML usando o renderer modificado.
  marked(markdown, { renderer });

  return links;
}

// Função que valida um link fazendo uma requisição HTTP usando fetch.
function validateLink(link) {
  return new Promise((resolve) => {
    fetch(link.href)
      .then((response) => {
        link.status = response.status;
        link.ok = response.ok;
        resolve(link);
      })
      .catch(() => {
        link.status = 404;
        link.ok = false;
        resolve(link);
      });
  });
}

// Função que verifica se o arquivo tem extensão .md (Markdown).
function fileMD(filePath) {
  const ext = path.extname(filePath);
  return ext === '.md';
}

// Função que lê o conteúdo de um arquivo e extrai os links usando a função extractLinks.
function readAndExtractLinks(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const links = extractLinks(data);
      resolve(links);
    });
  });
}

// Função que lê um diretório recursivamente, buscando arquivos Markdown para extrair os links.
function readDirectoryRecursive(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      // Mapeia os arquivos/diretórios e executa a função correta para cada um.
      const filePromises = files.map((file) => {
        const filePath = path.join(directoryPath, file.name);
        if (file.isDirectory()) {
          return readDirectoryRecursive(filePath);
        } else if (fileMD(filePath)) {
          return readAndExtractLinks(filePath);
        }
        return null;
      });

      // Resolve as promises resultantes das leituras de arquivos e diretórios.
      Promise.all(filePromises)
        .then((results) => {
          const allLinks = results.filter((links) => links !== null).flat();
          resolve(allLinks);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

// Função principal que recebe o caminho de um arquivo ou diretório e opções de configuração.
// Retorna uma Promise que resolve com os links encontrados ou rejeita em caso de erro.
function mdLinks(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath);

    // Verifica as estatísticas do arquivo/diretório.
    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      // Se for um diretório, lê os arquivos de forma recursiva e extrai os links.
      if (stats.isDirectory()) {
        readDirectoryRecursive(absolutePath)
          .then((links) => {
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
          })
          .catch((error) => {
            reject(error);
          });
        // Se for um arquivo Markdown, lê o conteúdo e extrai os links.
      } else if (fileMD(absolutePath)) {
        readAndExtractLinks(absolutePath)
          .then((links) => {
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
          })
          .catch((error) => {
            reject(error);
          });
        // Se for outro tipo de arquivo, rejeita a Promise com um erro.
      } else {
        reject(new Error('Caminho do arquivo inválido, a extensão precisa ser ".md"'));
      }
    });
  });
}

// Exporta a função mdLinks para ser utilizada em outros arquivos.
module.exports = { mdLinks };
