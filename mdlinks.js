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
          console.log(`Total: ${statistics.total}`);
          console.log(`Unique: ${statistics.unique}`);
          console.log((`Broken: ${(statistics.broken)}`)); 
          const cliTable = new table({
            head: ['HREF', 'TEXT' , 'FILE', 'STATUS'],
            colWidths: [35, 35, 12, 10],
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
            cliTable.push([link.href, text, link.file, status]);
          });

          console.log(tableChalk(cliTable.toString()));
        } else if (options.stats) {
          console.log(`Total: ${statistics.total}`);
          console.log(`Unique: ${statistics.unique}`);
        } else if (options.validate) {
          /* links.forEach((link) => {
            console.log(`href: ${link.href}`);
            console.log(`text: ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            console.log(`file: ${link.file}`);
            console.log(`Status Number: ${link.status}`);
            if (link.ok === 'ok') {
              console.log(okChalk(`status: ${link.ok}`));
            } else {
              console.log(erroChalk(`status: ${link.ok}`));
            }
            console.log('***********');
          }); */

          const cliTable = new table({
            head: ['HREF', 'TEXT' , 'FILE', 'STATUS', 'STATUS NUMBER'],
            colWidths: [35, 35, 12, 12,18],
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
