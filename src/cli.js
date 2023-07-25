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
      const validatePromises = links.map(validateLink);
      Promise.all(validatePromises)
        .then((validatedLinks) => {
          const table = new Table({
            head: [chalk.magenta('LINK'), chalk.magenta('STATUS'), chalk.magenta('COD'), chalk.magenta('TEXT')],
            colWidths: [40, 10, 10, 20],
          });

          validatedLinks.forEach((link) => {
            const linkColor = chalk.gray(link.href);
            const validateColor = link.ok ? chalk.green('ok') : chalk.red('fail');
            const codColor = chalk.gray(link.status || '');
            const textColor = chalk.gray(link.text);
            table.push([linkColor, validateColor, codColor, textColor]);
          });

          console.log(table.toString());

          if (options.stats) {
            const uniqueLinks = new Set(links.map((link) => link.href));
            const brokenLinks = validatedLinks.filter((link) => !link.ok);

            console.log(chalk.green(`Total: ${links.length}`));
            console.log(chalk.green(`Unique: ${uniqueLinks.size}`));
            console.log(chalk.red(`Broken: ${brokenLinks.length}`));
          }
        });
    } else if (options.stats) {
      const uniqueLinks = new Set(links.map((link) => link.href));
      console.log(chalk.green(`Total: ${links.length}`));
      console.log(chalk.green(`Unique: ${uniqueLinks.size}`));
    } else {
      links.forEach((link) => {
        console.log(`${link.href} ${link.text}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
