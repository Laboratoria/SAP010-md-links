const fs = require("fs").promises; // módulo arquivos
const path = require("path"); // módulo caminhos
const axios = require("axios"); //módulo para testar links HTTP

//const chalk = require("chalk"); // módulo personalização cores


//ETAPAS//

//criar promisse
//transformar rota de relativa para absoluta (módulo path, com seu método resolve()).
//verificar se a rota existe no computador (se a rota inserida estiver errada, a função mdLinks()deverá ser rechaçada com um erro).

//verificar se o arquivo é Markdown (extensões: .md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text)

//se não é markdown a promessa da função mdLinks deverá ser refeita com um erro.
//modulo path

//Ler o arquivo .md (ler esse arquivo e retorna ao seu conteúdo. Para ver este conteúdo você pode usar um console.log()momento para executar a função.)

//O módulo fs(FileSystem) será útil. Como mencionamos nas considerações técnicas, preferimos usar readFile(no lugar de readFileSync) e recomendamos o módulo fs/promises para usar essas funções com promessas.

//Encontrar os links dentro do documento e extrair os links encontrados dentro dele. Esses links tendem a armar dentro de um armário para que a função de mdLinkslos possa resolver.


//caminho: verificar se arquivo existe > verificar extensão > acessar arquivo > ler arquivo > extrair links


//IMPORTAR ARQUIVO MDLINK//

//const mdLinks = require("./src/files/links-to-check.md");
//mdLinks("./src/files/dir-files")
//mdLinks("./src/files/empty-no-links.md")
mdLinks("./src/files/links-to-check.md", true)
  .then(links => {
    console.log(links);
  })
  .catch(console.error);

//CONSTRUIR FUNÇÃO PARA MARKDOWN - ler arquivo e extrair link //

/* function readFileMarkdown(filePath) {
  return fs.readFile(filePath, 'utf-8')
    .then((content) => {
      const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
      const links = [];
      let match = regex.exec(content);

      while (match !== null) {
        const [, text, href] = match;
        links.push({ href, text, file: filePath });
        match = regex.exec(content);
      }
      return links;
    })
    .catch((error) => {
      throw new Error(`Erro ao processar o arquivo: ${error.message}`);
    });
} */

function readFileMarkdown(content, filePath) {
  const regex = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  const links = [];
  let match = regex.exec(content);

  while (match !== null) {
    const [, text, href] = match;
    links.push({ href, text, file: filePath });
    match = regex.exec(content);
  }
  return links;
}

//CONSTRUIR FUNÇÃO PARA DIRETÓRIO //

function readDirectoryMd(directoryPath) {
  return fs.readdir(directoryPath)
    .then(files => {
      const filePromises = files.map(file => {
        const fullPath = path.join(directoryPath, file);
        return fs.stat(fullPath)
          .then(stats => {
            if (stats.isDirectory()) {
              return readDirectoryMd(fullPath);
            } else if (['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(file))) {
              return readFileMarkdown(fullPath);
            }
            return [];
          });
      });

      return Promise.all(filePromises)
        .then(fileLinks => fileLinks.flat());
    });
}

// CONSTRUIR FUNÇÃO VALIDAR //

function validateLinkFile(link) {
  return axios.head(link.href)
    .then(response => ({
      ...link,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 ? 'ok' : 'fail',
    }))
    .catch(error => ({
      ...link,
      status: error.response ? error.response.status : 'N/A',
      ok: 'fail',
    }));
}

// FUNÇÃO PARA VALIDAR LINKS //
function validateMarkdownLinks(links) {
  const linkPromises = links.map(link => validateLinkFile(link));
  return Promise.all(linkPromises)
    .then(validatedLinks => validatedLinks)
    .catch(error => {
      throw new Error(`Erro ao validar links: ${error.message}`);
    });
}

// CONSTRUIR FUNÇÃO PEGAR STATUS //

// CONSTRUIR FUNÇÃO MD LINKS //

function mdLinks(filePath, validate = false) {
  const absolutePath = path.resolve(filePath);

  return new Promise((resolve, reject) => {
    fs.stat(absolutePath)
      .then(stats => {
        if (stats.isDirectory()) {
          // Colocar aqui função para ler arquivos de diretório
          return readDirectoryMd(absolutePath)
            .then((links) => {
              if (validate) {
                return validateMarkdownLinks(links);
              } else {
                resolve(links);
              }
            })
            .catch(reject);
        } else if (stats.isFile() && ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'].includes(path.extname(absolutePath))) {
          return fs.readFile(absolutePath, 'utf-8')
            .then((content) => {
              const links = readFileMarkdown(content, absolutePath);
              if (validate) {
                return validateMarkdownLinks(links);
              } else {
                resolve(links);
              }
            })
            .catch(reject);
        } else {
          reject(new Error('O arquivo não é um diretório nem um arquivo Markdown.'));
        }
      })
      .catch(error => {
        reject(new Error(`Erro: ${error.message}`));
      });
  });
}

//função MD LINKS ANTES DE DIRETORIO

/* function mdLinks(filePath) {
  const absolutePath = path.resolve(filePath);

  return new Promise((resolve, reject) => {
    fs.stat(absolutePath)
      .then(stats => {
        if (stats.isFile()) {
          return fs.readFile(absolutePath, 'utf-8')
            //aqui pegar função para ler markdown
            .then(content => readFileMarkdown(absolutePath))
            .then(resolve)
            .catch(reject);
        } else if (stats.isDirectory()) {

}
      })
      .catch(error => {
        throw new Error(`Erro: ${error.message}`);
      });
  });
} */

module.exports = {
  mdLinks, readFileMarkdown, validateLinkFile, readDirectoryMd,
};
