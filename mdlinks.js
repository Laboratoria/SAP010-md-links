#!/usr/bin/env node
const program = require('commander');
const mdlinks = require('./index.js');

program
  .version('1.0.0')
  .arguments('<caminhoArquivo>')
  .option('--validate', 'Validar os links')
  .action((caminhoArquivo, options) => {
    mdlinks(caminhoArquivo, options);
  });

program.parse(process.argv);






