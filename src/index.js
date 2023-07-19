const fs = require('fs');

const filePath = './src/files/files.md';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro de leitura', err);
    return;
  }

  
  console.log(data);
});