const path = require('path'); 
const fetch = require('cross-fetch'); 
const { mdlinks, findFileRecursive, validateFetch } = require('../index.js');

jest.mock('cross-fetch', () => jest.fn()); // Cria um mock para a função 'fetch' usando o Jest

// Descreve o conjunto de testes para a função 'validateFetch'
describe('validateFetch', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch);
  });


  describe('validateFetch', () => {
    it('Deve validar corretamente os links md', () => {
      const links = { text: 'Markdown', href: 'http://example.com', file: 'README.md' };
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
      });
      return validateFetch(links).then((result) => {
        expect(result).toEqual(
          { text: 'Markdown', href: 'http://example.com', file: 'README.md', status: 200, ok: 'ok' },
        );
      });
    });
  });

  it('Deve retornar o status "fail" quando a requisição falhar', () => {
    const url = {
      href: 'http://example.co',
    };
    mockFetch.mockRejectedValueOnce(new Error('Request failed'));
    return validateFetch(url).then((result) => {
      expect(result).toEqual({
        ...url,
        status: 'Request failed',
        ok: 'fail',
      });
    });
  });


  describe('mdlinks', () => {
    it('Deve retornar os links para um arquivo Markdown', () => {
      const filePath = './README.md';
      const expectedLinks =
        { text: 'Markdown', href: 'https://pt.wikipedia.org/wiki/Markdown', file: 'README.md' };
      return mdlinks(filePath).then((result) => {
        expect(result.links[0]).toEqual(expectedLinks);
      });
    });

    it('Deve retornar uma mensagem informando que o arquivo não é um Markdown', () => {
      const file = 'teste.txt';
      return mdlinks(file).catch((error) => {
        expect(error.message).toEqual(`O ${file} não é um arquivo Markdown`);
      });
    });

  it('Deve calcular corretamente as estatísticas dos links', () => {
    const filePath = 'pag/teste.md';
    const options = {};
    return mdlinks(filePath, options).then(({ statistics }) => {
      expect(statistics.total).toBe(2);
      expect(statistics.unique).toBe(2);
      expect(statistics.broken).toBe(0);
    });
  });
  });


  describe('findFileRecursive', () => {
    it('Deve chamar a função de callback para cada arquivo Markdown encontrado', () => {
      const callback = jest.fn();
      return findFileRecursive(directory).then(() => {
        expect(directory,).toHaveBeenCalledTimes(1);
        expect(directory,).toHaveBeenCalledWith(path.normalize('teste.md')); // uso o path .normalize para pega a / correta
      });
    });
  });
});
