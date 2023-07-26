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
    const uniqueLinks = new Set();
    const duplicateLinks = new Set();

    if (options.validate) {
      const validatePromises = links.map((link) => {
        if (!uniqueLinks.has(link.href)) {
          uniqueLinks.add(link.href);
          return validateLink(link);
        } else {
          duplicateLinks.add(link.href);
          return { ...link, ok: chalk.bold.blue('duplicate') };
        }
      });

      return Promise.all(validatePromises)
        .then((validatedLinks) => {
          const table = new Table({
            head: [chalk.bold.magenta('LINK'), chalk.bold.magenta('STATUS'), chalk.bold.magenta('COD'), chalk.bold.magenta('TEXT')],
            colWidths: [40, 20, 10, 20],
          });

          validatedLinks.forEach((link) => {
            const linkColor = chalk.white.bold(link.href);
            const validateColor = link.ok === true ? chalk.green.bold('OK') : chalk.red.bold(link.ok);
            const codColor = chalk.gray.bold(link.status || 0);
            const textColor = chalk.gray.bold(link.text);
            table.push([linkColor, validateColor, codColor, textColor]);
          });

          console.log(table.toString());

          if (options.stats) {
            const brokenLinks = validatedLinks.filter((link) => link.ok === false);

            console.log('|-------------------|');
            console.log(chalk.white.bold(`  Total: ${validatedLinks.length}`));
            console.log('|-------------------|');
            console.log(chalk.green.bold(`  Unique: ${uniqueLinks.size}`));
            console.log('|-------------------|');
            console.log(chalk.red.bold(`  Broken: ${brokenLinks.length}`));
            console.log('|-------------------|');
            console.log(chalk.blue.bold(`  Duplicate: ${duplicateLinks.size}`));
            console.log('|-------------------|');
          }
        });
    } else if (options.stats) {
      links.forEach((link) => {
        if (!uniqueLinks.has(link.href)) {
          uniqueLinks.add(link.href);
        } else {
          duplicateLinks.add(link.href);
        }
      });
      console.log('|-------------------|');
      console.log(chalk.white.bold(`  Total: ${links.length}`));
      console.log('|-------------------|');
      console.log(chalk.green.bold(`  Unique: ${uniqueLinks.size}`));
      console.log('|-------------------|');
      console.log(chalk.blue.bold(`  Duplicate: ${duplicateLinks.size}`));
      console.log('|-------------------|');
      
    } else {
      const table2 = new Table({
        head: [chalk.magenta('LINK'), chalk.magenta('TEXT')],
        colWidths: [40, 20],
      });

      links.forEach((link) => {
        const linkColor = chalk.gray(link.href);
        const textColor = chalk.gray(link.text);
        table2.push([linkColor, textColor]);
      });

      console.log(table2.toString());
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
