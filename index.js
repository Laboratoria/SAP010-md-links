const fs = require('fs');
const path = require('path');
const fetch = require('cross-fetch');

function mdlinks(file, options) {
  const filePath = path.resolve(file);

  if (path.extname(file) === '.md') {
    return readMarkdownFile(filePath, options);
  } else {
    console.log(`O ${file} não é um arquivo Markdown`);
    return Promise.resolve([]);
  }
}

function readMarkdownFile(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const links = findLinksInMarkdown(data, filePath);

        if (options && options.validate) {
          validateLinks(links)
            .then((validatedLinks) => {
              const statistics = statisticsLinks(validatedLinks);
              resolve({ links: validatedLinks, statistics });
            })
            .catch((error) => reject(error));
        } else {
          const statistics = statisticsLinks(links);
          resolve({ links, statistics });
        }
      }
    });
  });
}

function fileRecursion(pathDir, fileCb) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathDir, (err, myFiles) => {
      if (err) {
        reject(err);
        return;
      }
      const promises = myFiles.map((filePath) => {
        const fileFound = path.join(pathDir, filePath);
        return new Promise((resolveFile, rejectFile) => {
          fs.stat(fileFound, (err, stats) => {
            if (err) {
              rejectFile(err);
              return;
            }
            if (stats.isDirectory()) {
              fileRecursion(fileFound, fileCb)
                .then(resolveFile)
                .catch(rejectFile);
            } else if (stats.isFile() && path.extname(fileFound) === '.md') {
              fileCb(fileFound);
              resolveFile();
            } else {
              resolveFile();
            }
          });
        });
      });
      Promise.all(promises)
        .then(resolve)
        .catch(reject);
    });
  });
}

function findLinksInMarkdown(data, filePath) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const links = [];
  let match;
  while ((match = regex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    const fileName = path.basename(filePath);
    links.push({ text, href, file: fileName });
  }
  return links;
}

function validateFetch(url) {
  return fetch(url.href)
    .then((response) => {
      if (response.ok) {
        return {
          ...url,
          status: response.status,
          ok: 'ok',
        };
      } else {
        return {
          ...url,
          status: response.status,
          ok: 'fail',
        };
      }
    })
    .catch((error) => ({
      ...url,
      status: error.message,
      ok: 'fail',
    }));
}

function validateLinks(links) {
  const linkPromises = links.map((link) => validateFetch(link));
  return Promise.all(linkPromises);
}

function statisticsLinks(links) {
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === 'fail').length;
  return {
    total: totalLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

module.exports = { mdlinks, fileRecursion,findLinksInMarkdown, validateFetch, statisticsLinks, readMarkdownFile };
