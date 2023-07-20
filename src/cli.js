#!/usr/bin/env node

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
    if (options.stats) {
      console.log(`Total: ${links.length}`);
      console.log(`Unique: ${new Set(links.map((link) => link.href)).size}`);
      const brokenLinks = links.filter((link) => !link.ok);
      console.log(`Broken: ${brokenLinks.length}`);
    } else {
      links.forEach((link) => {
        if (options.validate) {
          console.log(`${link.href} ${link.ok ? 'ok' : 'fail'} ${link.status || ''} ${link.text}`);
        } else {
          console.log(`${link.href} ${link.text}`);
        }
      });
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
