const fs = require('fs');

const caminhoDoArquivo = './files/files.md';

function readFile(caminhoDoArquivo) {
  return new Promise((resolve, reject) => {
    fs.readFile(caminhoDoArquivo, 'utf8', (error, data) => {
      if (error) {
        console.error('erro ao ler o arquivo', error);
        reject(error); // rejeita a promessa em caso de erro
      } else {
        resolve(data); // resolve e imprime 
      }
    });
  });
}

