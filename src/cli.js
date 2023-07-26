#!/usr/bin/env node
const chalk = require('chalk');
const Table = require('cli-table3');
const { mdLinks, validateLink } = require('./md-links.js');

const [, , filePath, ...args] = process.argv;

const options = {};
args.forEach((arg) => {
  if (arg === '--validate') {
    options.validate = true;
  } else if (arg === '--stats') {
    options.stats = true;
  }
});

mdLinks(filePath)
  .then((links) => {
    if (options.validate) {
      const validatePromises = links.map((link) => validateLink(link));

      return Promise.all(validatePromises).then((validatedLinks) => {
        const table = new Table({
          head: [chalk.bold.magenta('LINK'), chalk.bold.magenta('STATUS'), chalk.bold.magenta('COD'), chalk.bold.magenta('TEXTO')],
          colWidths: [40, 20, 10, 20],
        });

        const uniqueLinks = new Set();
        validatedLinks.forEach((link) => {
          const linkColor = chalk.white.bold(link.href);
          const validateColor = link.ok === true ? chalk.green.bold('OK') : chalk.red.bold(link.ok);
          const codColor = chalk.gray.bold(link.status || 0);
          const textColor = chalk.gray.bold(link.text);
          table.push([linkColor, validateColor, codColor, textColor]);
          uniqueLinks.add(link.href);
        });

        console.log(table.toString());

        if (options.stats) {
          const brokenLinks = validatedLinks.filter((link) => link.ok === false);

          console.log('--------------------');
          console.log(chalk.white.bold(`  Total: ${validatedLinks.length}`));
          console.log('|-------------------|');
          console.log(chalk.green.bold(`  Únicos: ${uniqueLinks.size}`));
          console.log('|-------------------|');
          console.log(chalk.red.bold(`  Quebrados: ${brokenLinks.length}`));
          console.log('--------------------');
        }
        return null;
      });
    } else if (options.stats) {
      console.log('--------------------');
      console.log(chalk.white.bold(`  Total: ${links.length}`));
      console.log('|-------------------|');
      console.log(chalk.green.bold(`  Únicos: ${new Set(links.map((link) => link.href)).size}`));
      console.log('--------------------');
      return null;
    } else {
      const table2 = new Table({
        head: [chalk.magenta('LINK'), chalk.magenta('TEXTO')],
        colWidths: [40, 20],
      });

      links.forEach((link) => {
        const linkColor = chalk.gray(link.href);
        const textColor = chalk.gray(link.text);
        table2.push([linkColor, textColor]);
      });

      console.log(table2.toString());
      return null;
    }
  })
  .catch((error) => {
    console.error('Erro:', error.message);
  });
