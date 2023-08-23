// const readFileContent = require('../index');
const mdLinks = require('../index');
const readFileContent = require('../index');
// const path = require('path');

describe('teste da função mdLinks', () => {
  test('a função mdLinks deve resolver uma array de objetos', async () => {
    const funcaoMdLinks = await mdLinks('README.md');
    expect(typeof funcaoMdLinks).toBe('object');
  });

  test('a função deve chamar readFileContent', () => {
    const rota = 'teste.md';
    const readFileContent = jest.fn();
    readFileContent(rota);
    expect(readFileContent).toHaveBeenCalledTimes(1);
  })

  test('deve rejeitar se o arquivo estiver vazio', async () => {
    const fakeFile = 'arquivoinexist.md';
    return mdLinks(fakeFile).catch(error => {
      expect(error.message).toBe('Este arquivo não existe');
    });
  })

  test('deve rejeitar o arquivo diferente de md', async () => {
    const fakeMdFile = 'index.js';
    return mdLinks(fakeMdFile).catch(error => {
      expect(error.message).toBe('O arquivo não é um arquivo markdown');
    });
  });


  // test('os links foram recebidos', () => {
  //   const rota = 'teste.md';
  //   return expect(mdLinks(rota)).resolves.toStrictEqual([
  //     {
  //       href: 'https://github.com/markedjs/marked',
  //       texto: 'marked',
  //       file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md'
  //     },
  //     {
  //       href: 'https://github.com/workshopper/learnyounode',
  //       texto: 'learnyounode',
  //       file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md'
  //     },
  //     {
  //       href: 'https://docs.npmjs.com/getting-started/what-is-npm',
  //       texto: 'NPM ',
  //       file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md'
  //     }
  //   ])
  // })

  // test('a função rejeita o arquivo', async () => {
  //   const fakeMdFile = 'arquivo.txt';
  //   return mdLinks(fakeMdFile).catch(error => {
  //     expect(error.message).toBe('Este arquivo não existe');
  //   });
  // });
})