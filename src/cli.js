#!/usr/bin/env node

const {mdLinks} = require("./index")
const path = process.argv[2];

const options = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats"),
};

mdLinks(path, options)

/*mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }, ...]
  })
  .catch(console.error);*/