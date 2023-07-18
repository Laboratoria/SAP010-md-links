#!/usr/bin/env node

const program = require('commander');
const { mdlinks } = require('./index.js');
const chalk = require('chalk');
const Table = require('cli-table3');

const erroChalk = (texto) => chalk.red.italic(texto);
const okChalk = (texto) => chalk.green.italic(texto);
const hrefChalk = (texto) => chalk.blue.italic(texto);
const textChalk = (texto) => chalk.green.italic(texto);
const fileChalk = (texto) => chalk.magenta.italic(texto);
const statusChalk = (status) => {
  if (status === 'ok') {
    return chalk.blue.italic(status);
  } else if (status === 'broken') {
    return chalk.red.italic(status);
  } else {
    return chalk.yellow.italic(status);
  }
};

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
          const cliTableVali = new Table({
            head: ['HREF', 'TEXT', 'FILE', 'STATUS'],
            colWidths: [35, 35, 20, 15], // Ajustando a largura das colunas para evitar quebras
            style: {
              head: ['white', 'bold'],
              border: ['cyan'],
              'padding-left': 0, // Removendo o espaço extra à esquerda para diminuir o tamanho da fonte
              'padding-right': 0, // Removendo o espaço extra à direita para diminuir o tamanho da fonte
            },
          });

          links.forEach((link) => {
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            const status = link.ok === 'ok' ? okChalk(link.ok) : erroChalk(link.ok);
            cliTableVali.push([hrefChalk(link.href), textChalk(text), fileChalk(link.file), statusChalk(status + ' => ' + link.status)]);
          });

          console.log(cliTableVali.toString());

          const cliTable = new Table({
            head: ['STATS', 'UNIQUE', 'BROKEN'],
            colWidths: [10, 10, 10],
            style: {
              head: ['white', 'bold'],
              border: ['cyan'],
            },
          });

          cliTable.push([statistics.total, statistics.unique, statistics.broken]);
          console.log(cliTable.toString());
        } else if (options.stats) {
          const cliTable = new Table({
            head: ['STATS', 'UNIQUE', 'BROKEN'],
            colWidths: [10, 10, 10],
            style: {
              head: ['white', 'bold'],
              border: ['cyan'],
            },
          });

          cliTable.push([statistics.total, statistics.unique, statistics.broken]);
          console.log(cliTable.toString());
        } else if (options.validate) {
          const cliTable = new Table({
            head: ['HREF', 'TEXT', 'FILE', 'STATUS'],
            colWidths: [35, 35, 20, 15],
            style: {
              head: ['white', 'bold'],
              border: ['cyan'],
              'padding-left': 0,
              'padding-right': 0,
            },
          });

          links.forEach((link) => {
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            const status = link.ok === 'ok' ? okChalk(link.ok) : erroChalk(link.ok);
            cliTable.push([hrefChalk(link.href), textChalk(text), fileChalk(link.file), statusChalk(status + ' => ' + link.status)]);
          });

          console.log(cliTable.toString());
        } else {
          const cliTable = new Table({
            head: ['HREF', 'TEXT', 'FILE'],
            colWidths: [45, 45, 12],
            style: {
              head: ['white', 'bold'],
              border: ['cyan'],
            },
          });

          links.forEach((link) => {
            const text = (` ${link.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}`);
            cliTable.push([hrefChalk(link.href), textChalk(text), fileChalk(link.file)]);
          });

          console.log(cliTable.toString());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

program.parse(process.argv);
