#!/usr/bin/env node

const program = require('commander');
const { mdlinks } = require('./index.js');
const chalk = require('chalk');
const table = require('cli-table');

const erroChalk = (texto) => chalk.bold.rgb(0,0,0).bgRgb(255,0,0) (texto);
const okChalk = (texto) => chalk.blackBright.bold.bgGreen.bold (texto);
const tableChalk = (texto) => chalk.bold.rgb(240,248,255).bgRgb(128,0,128)(texto);

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
          const cliTableVali= new table({
            head: ['HREF', 'TEXT' , 'FILE', 'STATUS'],
            colWidths: [25, 12, 10, 10], 
            style: { 
              head: ['blue', 'bold'], 
              border: ['white'], 
              default: true,
              
            },
            colAligns: ['left', 'left'],
          });
        
          links.forEach((link) => {
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            const status = link.ok === 'ok' ? okChalk(link.ok) : erroChalk(link.ok);
            cliTableVali.push([link.href, text, link.file, status]);
          });
          console.log(tableChalk(cliTableVali.toString()));
          const cliTable = new table({
            head: ['STATS', 'UNIQUE','BROKEN' ],
            colWidths: [10, 10, 10],
            style: { 
              head: ['blue', 'bold'], 
              border: ['white'], 
              default: true, 
            },
            colAligns: ['left','left'], 
          });
          cliTable.push([statistics.total, statistics.unique, statistics.broken]);
          console.log(tableChalk(cliTable.toString()));
        } else if (options.stats) {
          const cliTable = new table({
            head: ['STATS', 'UNIQUE','BROKEN' ],
            colWidths: [10, 10, 10],
            style: { 
              head: ['blue', 'bold'], 
              border: ['white'], 
              default: true,
              
            },
            colAligns: ['left','left'],
          });
          cliTable.push([statistics.total, statistics.unique, statistics.broken]);
          console.log(tableChalk(cliTable.toString()));
        } else if (options.validate) {
          const cliTable = new table({
            head: ['HREF', 'TEXT' , 'FILE', 'STATUS', 'STATUS NUMBER'],
            colWidths: [25, 15, 10, 10,10],
            style: { 
              head: ['blue', 'bold'], 
              border: ['white'], 
              default: true, 
            },
            colAligns: ['left','left'],
          });

          links.forEach((link) => {
            const status = link.ok === 'ok' ? okChalk(link.ok) : erroChalk(link.ok);
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            cliTable.push([link.href, text, link.file, status, link.status]);
          });
          console.log(tableChalk(cliTable.toString()));
          
        } else {
          
          const cliTable = new table({
            head: ['HREF', 'TEXT' , 'FILE'],
            colWidths: [35, 35, 12],
            style: { 
              head: ['blue', 'bold'], 
              border: ['white'], 
              default: true,
              
            },
            colAligns: ['left','left'],
          });

          links.forEach((link) => {
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            cliTable.push([link.href, text, link.file]);
          });

        console.log(tableChalk(cliTable.toString()));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

program.parse(process.argv);
