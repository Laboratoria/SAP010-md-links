#!/usr/bin/env node
const { mdLinks } = require("./index");

const args = process.argv.slice(2);

const filePath = args[0];

let options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats')
};

console.log('options', options)

mdLinks(filePath, options)
  .then((links) => {
    if (options.stats && options.validate) {
      const stats = {
        total: links.length,
        unique: [...new Set(links.map(link => link.href))].length,
        broken: links.filter(link => link.ok === 'fail').length
      };
      console.log(`Total: ${stats.total}\nUnique: ${stats.unique}\nBroken: ${stats.broken}`);
    } else if (options.stats) {
      const stats = {
        total: links.length,
        unique: [...new Set(links.map(link => link.href))].length
      };
      console.log(`Total: ${stats.total}\nUnique: ${stats.unique}`);
    } else if (options.validate) {
      console.log(links);
    } else {
      options.validate = false;
      console.log(links);
    }
  })
  .catch((error) => {
    console.error(error);
  })