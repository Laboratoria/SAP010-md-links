const mdLinks = require("./index.js");
const pathInput = process.argv[2];

const optionsInput = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats"),
  validateAndStats:
  process.argv.includes("--validate") && process.argv.includes("--stats"),
};

mdLinks(pathInput, optionsInput).then()