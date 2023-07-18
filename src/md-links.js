/* const { read } = require('./read.js');
const { validateFunction, getLinks } = require('./options.js');

function mdLinks(pathFile, option) {
  return new Promise((resolve, reject) => {
    read(pathFile)
      .then((fileContent) => {
        if (!Array.isArray(fileContent)) {
          getLinks(fileContent)
            .then((linksObj) => {
              if (!option.validate) {
                resolve(linksObj);
              } else {
                validateFunction(linksObj)
                  .then((arrayLinkFetchResolved) => {
                    resolve(arrayLinkFetchResolved);
                  })
                  .catch(reject);
              }
            })
            .catch(reject);
        } else {
          Promise.all(fileContent.map((objContent) => getLinks(objContent)))
            .then((linksObjArray) => {
              resolve(linksObjArray.flat());
            })
            .catch(reject);
        }
      })
      .catch(reject);
  });
}

module.exports = { mdLinks }; */
