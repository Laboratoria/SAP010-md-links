
const { expect } = require('chai');
const readFile = require('../src/index'); 

describe('readFile', () => {
  it('deve ler o arquivo e resolver com o seu conteúdo', (done) => {
    const caminhoDoArquivo = './files/files.md';

    readFile(caminhoDoArquivo)
      .then((data) => {
        expect(data).to.be.a('string'); 
       
        done(); //concluido
      })
      .catch((error) => {
        done(error); 
      });
  });

  it('deve rejeitar a promessa se o arquivo não existir', (done) => {
    const caminhoDoArquivo = './caminho/inexistente.md'; // fake

