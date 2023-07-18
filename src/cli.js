const mdLinks = require('./index.js');
const getLinksWithStatus = require('./index');
const path = process.argv[2];
const axios = require('axios');

const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats:
    process.argv.includes('--validate') && process.argv.includes('--stats'),
};
let statsCount = 0
mdLinks(path, options).then((linkObjects) => {
  if (options.validate) {
    linkObjects.map((linkObj) => {
      return axios
        .get(linkObj.href)
        .then((response) => {
          linkObj.status = response.status;
          linkObj.Ok = "Ok"
          
          statsCount++
          console.log(linkObj, statsCount)
        })
        .catch((response) => {
          linkObj.status = 404;
          linkObj.Ok = "FAIL"
          console.log(linkObj);
        });
    });
    
  } else {
    linkObjects.forEach((link, index) => {
      console.log(`${index + 1}.`, link);
    });
  }
});
