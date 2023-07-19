const mdLinks = require('./index.js');
const path = process.argv[2];
const axios = require('axios');
const chalk = require('chalk');

const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats:
    process.argv.includes('--validate') && process.argv.includes('--stats'),
};

/* let okStatsCount = 0;
let failStatsCount = 0; */

mdLinks(path, options).then((linksObject) => {
  if (options.validate) {
    const linkPromises = linksObject.map((links) => {
      return axios
        .get(links.href)
        .then((response) => {
          links.status = response.status;
          if (response.status >= 200 && response.status < 300) {
            links.ok = 'Ok';
          } else if (response.status >= 300) {
            links.ok = 'FAIL';
          }
        })
        .catch(() => {
          links.status = 'Erro ao realizar requisição HTTP';
          links.ok = 'FAIL';
        });
    });

    Promise.all(linkPromises).then(() => {
      printLinks(linksObject);
    });
  } else {
    printLinks(linksObject);
  }
});

function printLinks(linksObject) {
  linksObject.forEach((link) => {
    if (link.ok === 'Ok') {
      console.log(chalk.cyan(`\nhref: ${link.href} `));
      console.log(chalk.yellow(`text: ${link.text}`));
      console.log(chalk.magenta(`file: ${link.file}`));
      console.log(chalk.blue(`status: ${link.status}`));
      console.log(chalk.green(`ok: ${link.ok} \n`));
      console.log(
        `------------------------------------------------------------------------`
      );
    } else if (link.ok === 'FAIL') {
      console.log(chalk.cyan(`\nhref: ${link.href} `));
      console.log(chalk.yellow(`text: ${link.text}`));
      console.log(chalk.magenta(`file: ${link.file}`));
      console.log(chalk.red(`status: ${link.status}`));
      console.log(chalk.bgRed(`ok: ${link.ok} \n`));
      console.log(
        `------------------------------------------------------------------------`
      );
    } else {
      console.log(chalk.cyan(`\nhref: ${link.href} `));
      console.log(chalk.yellow(`text: ${link.text}`));
      console.log(chalk.magenta(`file: ${link.file} \n`));
      console.log(
        `------------------------------------------------------------------------`
      );
    }
  });
}
