#!/usr/bin/env node

const { mdLinks } = require("./index.js");
const path = require("path");

const caminhoDoArquivo = path.join(__dirname, "arquivos", "arquivo.md");

function printLink(link) {
  console.log(link);
}

/*function printStats(stats) {
  console.log(stats);
}*/

const options = process.argv.slice(3);
const isValidate = options.includes("--validate");
const isStats = options.includes("--stats");

if (isValidate && isStats) {
  mdLinks(caminhoDoArquivo, { validate: true, stats: true })
    .then((result) => {
      const stats = result.stats;
      console.log(
        `{ totalLinks: ${stats.totalLinks}, uniqueLinks: ${stats.uniqueLinks}, totalBrokenLinks: ${stats.totalBrokenLinks} }`
      );
    })
    .catch((err) => {
      console.error(err);
    });
} else if (isStats) {
  mdLinks(caminhoDoArquivo, { validate: false, stats: true })
    .then((result) => {
      console.log(
        `{ totalLinks: ${result.totalLinks}, uniqueLinks: ${result.uniqueLinks} }`
      );
    })
    .catch((err) => {
      console.error(err);
    });
} else if (isValidate) {
  mdLinks(caminhoDoArquivo, { validate: true, stats: false })
    .then((result) => {
      result.links.forEach(printLink);
    })
    .catch((err) => {
      console.error(err);
    });
} else {
  // Caso nenhum argumento seja passado, trata como se tivesse passado '--validate --stats'
  mdLinks(caminhoDoArquivo, { validate: true, stats: true })
    .then((result) => {
      const stats = result.stats;
      console.log(
        `{ totalLinks: ${stats.totalLinks}, uniqueLinks: ${stats.uniqueLinks}, totalBrokenLinks: ${stats.totalBrokenLinks} }`
      );
    })
    .catch((err) => {
      console.error(err);
    });
}