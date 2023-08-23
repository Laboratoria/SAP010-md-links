const mdLinks = require('../index');
const readFile = require('../index');

describe('teste da função mdLinks', () => {
  test('a função mdLinks resolve uma array de objetos', async () => {
    const funcaoMdLinks = await mdLinks('README.md');
    expect(typeof funcaoMdLinks).toBe('object');
  });

  test('a função rejeita o arquivo', async () => {
    const fakeMdFile = 'arquivo.txt';
    return mdLinks(fakeMdFile).catch(error => {
      expect(error.message).toBe('Este arquivo não existe');
    });
  });

  test('rejeita se o arquivo estiver vazio', async () => {
    const fakeFile = '';
    return readFile(fakeFile, 'utf-8').catch(error => {
      expect(error.message).toBe('Este arquivo não existe');
    });
  })
})
