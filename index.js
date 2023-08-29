const fs = require("fs").promises; // módulo arquivos
const path = require("path"); // módulo caminhos

//const markdownLinkExtractor = require("markdown-link-extractor"); // para extrair links de markdown

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
mdLinks("./src/files/links-to-check.md")
//mdLinks("./src/files/dir-files")
//mdLinks("./src/files/empty-no-links.md")
  .then(links => {
    console.log(links);
  })
  .catch(console.error);

  //CONSTRUIR FUNÇÃO PARA MARKDOWN //

function readLinksMarkdown(filePath) {
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
}

//CONSTRUIR FUNÇÃO PARA DIRETÓRIO //

/* function findInDirectory(directoryPath){
  return fs.readdir(directoryPath, (err, data))
    .then((filesDir) => {
      const markdownFile = filesDir.filter(file => path.extname(file) === '.md');
      const promises = markdownFile.map(markdown => {
        const filePath = path.join(directoryPath, markdown);
        return readLinksMarkdown(filePath);
      });
      return Promise.all(promises)
        .then(linksArrays => linksArrays.reduce((accumulator, links) => accumulator.concat(links), []));

    })
} */



// CONSTRUIR FUNÇÃO MD LINKS

function mdLinks(filePath) {
  const absolutePath = path.resolve(filePath);

  return new Promise((resolve, reject) => {

    fs.stat(absolutePath)
      .then(stats => {
        if (stats.isFile()) {
          return fs.readFile(absolutePath, 'utf-8')
          //aqui pegar função para ler markdown
            .then(content => readLinksMarkdown(absolutePath))
            .then(resolve)
            .catch(reject);
        } else if (stats.isDirectory()) {
          //colocar aqui função para diretorio

        }
      })
      .catch(error => {
        throw new Error(`Erro: ${error.message}`);
      });
  });
}




/* function mdLinks() {
  return new Promise((resolve, reject) => {
    const relativePath = './src/files/links-to-check.md';
    const absolutePath = path.resolve(relativePath); 
    //const absolutePath = path.resolve(filePath);

    fs.stat(absolutePath)
      .then(stats => {
        if (stats.isFile()) {
          return fs.readFile(absolutePath, 'utf-8')
            .then(resolve)
            .catch(reject);
        } else if (stats.isDirectory()) {
          return findDirectory(absolutePath)
            .then(resolve)
            .catch(reject);
        }
      })
      .catch(error => {
        throw new Error(`Erro: ${error.message}`);
      });
  });
} */

/* const mdLinks = new Promise((resolve, reject) => {
  const link = "x";

  if (link === "x") {
    const relativePath = './src/files/links-to-check.md';
    const absolutePath = path.resolve(relativePath); 
    // Caminho relativo para absoluto
    // Verificar se o arquivo existe

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        reject("O arquivo não existe");
      } else {
        resolve(absolutePath);
      }
    });
  } else {
    reject("Não tem link");
  }
});

mdLinks.then((data) => {
  console.log("Caminho absoluto:", data);
}).catch((error) => {
  console.error("Erro:", error);
}); */


/* const mdLinks = require("md-links");

mdLinks("./src/files/links-to-check.md")
  .then(links => {
    // => [{ href, text, file }, ...]
    console.log("mdLinks");
  })
  .catch(console.error);

  const mdLinks = require("md-links");

  mdLinks("./src/files/links-to-check.md")
    .then(links => {
      // => [{ href, text, file }, ...]
      console.log("mdLinks");
    })
    .catch(console.error);



  // LER ARQUIVO

/*   import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
}); */

module.exports = {
  mdLinks, readLinksMarkdown, findInDirectory
};
