const fs = require('fs');
const path = require('path');
const fetch = require('cross-fetch');

// Função principal para encontrar e processar links em arquivos Markdown.
function mdlinks(file, options) {
  const filePath = path.resolve(file);
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
         if (err.code === 'ENOENT') {
          reject(`O arquivo ${filePath} não foi encontrado.`);
        } else {
          reject(err);
        } 
      } else {
        if (stats.isDirectory()) {
          const markdownFiles = [];
          // Realizar busca recursiva para encontrar todos os arquivos Markdown dentro do diretório.
          searchRecursion(filePath, (file) => {
            if (file.endsWith('.md')) {
              markdownFiles.push(file);
            }
          });
          const promises = markdownFiles.map((mdFile) =>
            // Processar cada arquivo Markdown encontrado.
            readMarkdownFile(mdFile, options)
          );
          Promise.all(promises)
            .then((results) => {
              // Mesclar os resultados de todos os arquivos Markdown.
              const links = results.flatMap((result) => result.links);
              const statistics = statisticsLinks(links);
              resolve({ links, statistics });
            })
            .catch((error) => reject(error));
        } else if (stats.isFile() && path.extname(file) === '.md') {
          // Processar arquivo Markdown individualmente.
          readMarkdownFile(filePath, options)
            .then((result) => {
              resolve(result);
            })
            .catch((error) => reject(error));
        } else {
          reject(`O ${file} não é um arquivo Markdown.`);
          console.log(`O ${file} não é um arquivo Markdown.`)
        }
      }
    });
  });
}

// Função para realizar busca recursiva de arquivos e diretórios.
function searchRecursion(absDirPath, fileCallback) {
  try {
    const files = fs.readdirSync(absDirPath);

    for (const file of files) {
      const filePath = path.join(absDirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // Se for um diretório, realizar busca recursiva.
        searchRecursion(filePath, fileCallback);
      } else {
        // Se for um arquivo, executar o callback passando o caminho do arquivo.
        fileCallback(filePath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Função para ler e extrair os links de um arquivo Markdown.
function readMarkdownFile(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        // Encontrar todos os links no arquivo Markdown.
        const links = findLinksInMarkdown(data, filePath);

        if (options && options.validate) {
          // Se a opção de validação estiver ativada, validar os links encontrados.
          validateLinks(links)
            .then((validatedLinks) => {
              const statistics = statisticsLinks(validatedLinks);
              resolve({ links: validatedLinks, statistics });
            })
            .catch((error) => reject(error));
        } else {
          // Caso contrário, calcular apenas as estatísticas dos links encontrados.
          const statistics = statisticsLinks(links);
          resolve({ links, statistics });
        }
      }
    });
  });
}

// Função para encontrar todos os links em um arquivo Markdown.
function findLinksInMarkdown(data, filePath) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const links = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    const fileName = path.basename(filePath);
    links.push({ text, href, file: fileName });
  }
  return links;
}

// Função para validar um link fazendo uma requisição HTTP.
function validateFetch(url) {
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

// Função para validar todos os links encontrados.
function validateLinks(links) {
  const linkPromises = links.map((link) => validateFetch(link));
  return Promise.all(linkPromises);
}

// Função para calcular estatísticas dos links encontrados.
function statisticsLinks(links) {
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === 'fail').length;
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

module.exports = { mdlinks, validateLinks, searchRecursion, validateFetch, statisticsLinks };
