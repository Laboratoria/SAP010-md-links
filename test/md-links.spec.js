// const readFileContent = require('../index');
const mdLinks = require('../index');
const readFileContent = require('../index');
// const path = require('path');

describe('testes da função mdLinks', () => {
  test('a função mdLinks deve resolver uma array de objetos', async () => {
    const funcaoMdLinks = await mdLinks('README.md');
    expect(typeof funcaoMdLinks).toBe('object');
  });

  test('a função deve chamar readFileContent', () => {
    const rota = 'teste.md';
    const readFileContent = jest.fn();
    readFileContent(rota);
    expect(readFileContent).toHaveBeenCalledTimes(1);
  });

  test('deve rejeitar se o arquivo estiver vazio', async () => {
    const fakeFile = 'arquivoinexist.md';
    return mdLinks(fakeFile).catch(error => {
      expect(error.message).toBe('Este arquivo não existe');
    });
  });

  test('deve rejeitar o arquivo diferente de md', async () => {
    const fakeMdFile = 'index.js';
    return mdLinks(fakeMdFile).catch(error => {
      expect(error.message).toBe('O arquivo não é um arquivo markdown');
    });
  });
})

describe('testes da função readFileContent', () => {
  test('deve rejeitar o arquivo vazio', async () => {
    const emptyFile = 'empty.md';
    return readFileContent(emptyFile).catch(error => {
      expect(error.message).toBe('O arquivo está vazio');
    });
  });
})