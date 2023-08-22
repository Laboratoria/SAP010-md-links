#!/usr/bin/env node

const fs = require("fs").promises;
const { mdLinks } = require("./index.js");
const path = require("path");

const caminhoDoArquivo = process.argv[2];

if (!caminhoDoArquivo) {
  console.error("Por favor, informe o caminho do arquivo a ser processado.");
  process.exit(1);
}

const caminhoAbsolutoDoArquivo = path.resolve(caminhoDoArquivo);

function printLink(link) {
  console.log(link);
}

const options = process.argv.slice(3);
const isValidate = options.includes("--validate");
const isStats = options.includes("--stats");

function print(options = { validate: true, stats: true }, result) {
  if (options.validate && options.stats) {
    const stats = result.stats;
    console.log(`totalLinks: ${stats.totalLinks}`);
    console.log(`uniqueLinks: ${stats.uniqueLinks}`);
    console.log(`totalBrokenLinks: ${stats.totalBrokenLinks}`);
  } else if (options.stats) {
    console.log(`totalLinks: ${result.totalLinks}`);
    console.log(`uniqueLinks: ${result.uniqueLinks}`);
  } else if (options.validate) {
    result.links.forEach(printLink);
  } else if (!options.validate && !options.stats) {
    console.log(result);
  }
}

function processarLinks() {
  fs.stat(caminhoAbsolutoDoArquivo)
    .then((stats) => {
      if (stats.isDirectory()) {
        console.error("O caminho informado é um diretório. Por favor, informe o caminho de um arquivo.");
        process.exit(1);
      }

      return mdLinks(caminhoAbsolutoDoArquivo, {
        validate: isValidate,
        stats: isStats
      });
    })
    .then((result) => {
      const opt = { validate: isValidate, stats: isStats };
      print(opt, result);
    })
    .catch((error) => {
      console.error("Erro ao processar os links:");
      console.error(error);
    });
}

processarLinks();