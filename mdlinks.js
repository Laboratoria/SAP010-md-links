#!/usr/bin/env node

const program = require('commander');
/* const path = require('path'); */
const {mdlinks}  = require('./index.js');


program
  .version('1.0.0')
  .description('ferramenta para extrair e validar links em arquivos Markdown.')
  .option('--validate', 'Validar os links encontrados')
  .option('--stats', 'Exibir estatísticas dos links')
  .arguments('<path>')
  .action((file, options) => {
    mdlinks(file, options)
    .then(({ links, statistics }) => {
      if (options.validate && options.stats) {
        console.log(`Total: ${statistics.total}`);
        console.log(`Unique: ${statistics.unique}`);
        console.log(`Broken: ${statistics.broken}`);
      } else if (options.stats) {
        console.log(`Total: ${statistics.total}`);
        console.log(`Unique: ${statistics.unique}`);
      } else if (options.validate) {
        links.forEach((link) => {
          console.log(`href: ${link.href}`);
          console.log(`text: ${link.text}`);
          console.log(`file: ${link.file}`);
          console.log((`status: ${link.ok}`));
          console.log('***********');
        });
      } else {
        links.forEach((link) => {
          console.log(`Link: ${link.href}`);
          console.log(`Text: ${link.text}`);
          console.log(`File: ${link.file}`);
          console.log('----------------------------');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

program.parse(process.argv);











