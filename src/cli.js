/* const chalk = require('chalk');
const { mdLinks } = require('./md-links.js');

const args = process.argv.slice(2);
const path = args[0];

// Verificando se o argumento --validate ou --stats foi passado na linha de comando
const options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats'),
  validateAndStats: args.includes('--validate') && args.includes('--stats'),
};

mdLinks(path, options)
  .then((results) => {
    if (options.validateAndStats) {
      console.log(chalk.green('Total links:', results.length));
      console.log(chalk.yellow('Unique links:', new Set(results.map((link) => link.href)).size));
      console.log(chalk.red('Broken links:', results.filter((link) => link.ok === false).length));
    } else if (options.validate) {
      results.forEach((link) => {
        console.log(chalk.yellow('File:', link.file));
        console.log(chalk.magenta('Text:', link.text));
        console.log(chalk.cyan('Link:', link.href));
        console.log(chalk.green('Status HTTP:', link.status));
        console.log(chalk.green('OK:', link.ok));
        console.log('¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨');
      });
    } else if (options.stats) {
      console.log(chalk.green('Total links:', results.length));
      console.log(chalk.yellow('Unique links:', new Set(results.map((link) => link.href)).size));
    } else {
      results.forEach((link) => {
        console.log(chalk.yellow('File:', link.file));
        console.log(chalk.magenta('Text:', link.text));
        console.log(chalk.cyan('Link:', link.href));
        console.log('¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨');
      });
    }
  })
  .catch((error) => {
    console.error(error);
  }); */
