// Importando os módulos necessários
const fs = require('fs'); // Módulo para trabalhar com arquivos do sistema
const path = require('path'); // Módulo para trabalhar com caminhos de arquivo
const fetch = require('cross-fetch'); // Módulo para fazer requisições HTTP

// Função principal que recebe um arquivo e opções
function mdlinks(file, options) {
  const currentDirectory = process.cwd(); // Obtém o diretório atual do processo
  return findFileRecursive(currentDirectory, file) // Chama a função recursiva para encontrar o arquivo
    .then((filePath) => {
      if (filePath) {
        return readMarkdownFile(filePath, options); // Lê o arquivo Markdown e retorna os links encontrados
      } else {
        console.log(`O arquivo ${file} não é um arquivo md.`); // Se o arquivo não for encontrado, exibe uma mensagem de erro
        return Promise.resolve([]); // Retorna uma promessa resolvida vazia
      }
    })
    .catch((error) => {
      console.log(error); // Se ocorrer um erro, exibe a mensagem de erro
      return Promise.reject(error); // Retorna uma promessa rejeitada com o erro
    });
}

// Função recursiva para encontrar o arquivo em um diretório
function findFileRecursive(directory, fileName, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (error, files) => { // Lê os arquivos do diretório
      if (error) {
        reject(error); // Se ocorrer um erro, rejeita a promessa com o erro
        return;
      }

      const filePromises = files.map((file) => {
        const filePath = path.join(directory, file); // Cria o caminho completo do arquivo

        return new Promise((resolve) => {
          fs.stat(filePath, (error, stats) => { // Obtém informações sobre o arquivo
            if (!error && stats.isFile() && file === fileName && path.extname(file) === '.md') {
              resolve(filePath);
            } else if (!error && stats.isDirectory()) {
              resolve(findFileRecursive(filePath, fileName, options)); // Chama a função recursivamente para encontrar o arquivo dentro do diretório
            } else {
              resolve(null);
            }
          });
        });
      });

      Promise.all(filePromises)
        .then((results) => {
          const foundFile = results.find((filePath) => filePath !== null); // Encontra o primeiro caminho de arquivo não nulo
          if (foundFile) {
            resolve(foundFile);
          } else {
            resolve(null); // Se nenhum arquivo correspondente for encontrado, resolve a promessa com o valor nulo
          }
        })
        .catch((error) => reject(error));
    });
  });
}

// Função para ler o conteúdo de um arquivo Markdown
function readMarkdownFile(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => { // Lê o conteúdo do arquivo
      if (error) {
        console.log(error); // Se ocorrer um erro, exibe a mensagem de erro
        reject(error); // Rejeita a promessa com o erro
        return;
      }

      const links = findLinksInMarkdown(data, filePath); // Encontra os links no conteúdo do arquivo Markdown

      if (options && options.validate) { // Se a opção de validação estiver ativada
        validateLinks(links) // Valida os links encontrados
          .then((validatedLinks) => {
            const statistics = statisticsLinks(validatedLinks); // Calcula as estatísticas dos links
            resolve({ file: filePath, links: validatedLinks, statistics }); // Resolve a promessa com as informações dos links e as estatísticas
          })
          .catch((error) => {
            reject(error); // Se ocorrer um erro durante a validação, rejeita a promessa com o erro
          });
      } else {
        const statistics = statisticsLinks(links); // Calcula as estatísticas dos links
        resolve({ file: filePath, links, statistics }); // Resolve a promessa com as informações dos links e as estatísticas
      }
    });
  });
}

// Função para encontrar os links no conteúdo do arquivo Markdown
function findLinksInMarkdown(data, filePath) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm; // Expressão regular para encontrar os links
  const links = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    const text = match[1]; // Texto do link
    const href = match[2]; // URL do link
    const fileName = path.basename(filePath); // Nome do arquivo
    links.push({ text, href, file: fileName }); // Adiciona o link encontrado à lista de links
  }
  return links; // Retorna a lista de links encontrados
}

// Função para validar um link fazendo uma requisição HTTP
function validateFetch(url) {
  return fetch(url.href)
    .then((response) => {
      if (response.ok) {
        return {
          ...url,
          status: response.status,
          ok: 'ok',
        };
      } else {
        return {
          ...url,
          status: response.status,
          ok: 'fail',
        };
      }
    })
    .catch((error) => ({
      ...url,
      status: error.message,
      ok: 'fail',
    }));
}

// Função para validar todos os links encontrados
function validateLinks(links) {
  const linkPromises = links.map((link) => validateFetch(link)); // Cria uma lista de promessas para cada link a ser validado
  return Promise.all(linkPromises); // Retorna uma promessa que é resolvida quando todas as promessas individuais forem resolvidas
}

// Função para calcular as estatísticas dos links
function statisticsLinks(links) {
  const totalLinks = links.length; // Total de links
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length; // Total de links únicos
  const brokenLinks = links.filter((link) => link.ok === 'fail').length; // Total de links quebrados
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  }; // Retorna um objeto com as estatísticas dos links
}

// Exporta as funções para serem utilizadas por outros módulos
module.exports = { mdlinks, findFileRecursive, findLinksInMarkdown, validateFetch, statisticsLinks, readMarkdownFile };
