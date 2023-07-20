#!/usr/bin/env node
const chalk = require('chalk');
const Table = require('cli-table3');
const { mdLinks } = require('./md-links.js');

const [, , filePath, ...args] = process.argv;

const options = {};
args.forEach((arg) => {
  if (arg === '--validate') {
    options.validate = true;
  } else if (arg === '--stats') {
    options.stats = true;
  }
});

mdLinks(filePath, options)
  .then((links) => {
    if ((options.stats && options.validate) || (options.validate && options.stats)) {
      console.log(`Total: ${links.length}`);
      console.log(`Unique: ${new Set(links.map((link) => link.href)).size}`);
      const brokenLinks = links.filter((link) => !link.ok);
      console.log(chalk.red(`Broken: ${brokenLinks.length}`));
    } else if (options.stats) {
      console.log(`Total: ${links.length}`);
      console.log(`Unique: ${new Set(links.map((link) => link.href)).size}`);
    } else if (options.validate) {
      const table = new Table({
        head: [chalk.magenta('Link'), chalk.magenta('Status'), chalk.magenta('Cod'), chalk.magenta('Text')],
        colWidths: [40, 10, 10, 40],
      });
      links.forEach((link) => {
        const linkColor = chalk.gray(link.href);
        const validateColor = link.ok ? chalk.green('ok') : chalk.red('fail');
        const codColor = chalk.gray(link.status || '');
        const textColor = chalk.gray(link.text);
        table.push([linkColor, validateColor, codColor, textColor]);
      });

      console.log(table.toString());
    } else {
      links.forEach((link) => {
        console.log(`${link.href} ${link.text}`);
      });
    }
  })
  .catch((error) => {
    if (error.message === 'Nenhum arquivo encontrado') {
      console.error('Nenhum arquivo ou diretório encontrado no caminho especificado.');
    } else {
      console.error('Error:', error.message);
    }
  });
