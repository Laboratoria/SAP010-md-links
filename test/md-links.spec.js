import mdlinks from '../src/lib/index.js';
import path from 'path';
import fetch from 'cross-fetch';

jest.mock('cross-fetch', () => jest.fn());

describe('mdlinks', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch);
  });

  it('Deve extrair o link válido Markdown', () => {
    const filePath = 'src/pag/README.md';

    // Configurando o valor de retorno do mock para o teste
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true
    });

    return mdlinks(filePath).then(result => {
      expect(result.links[0]).toEqual(
        { text: 'Markdown', href: 'https://pt.wikipedia.org/wiki/Markdown', file: 'README.md' }
      );
    });
  });

  describe('mdlinks', () => {
    it('Deve retornar o nome do arquivo Markdown', () => {
      const file = 'src/pag/README.md';

      // Configurando o valor de retorno do mock para o teste
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true
      });

      return mdlinks(file).then(result => {
        expect(result.links[0].file).toBe(path.basename(file));
      });
    });
  });

  it('Deve retornar uma mensagem informando que o arquivo não é um Markdown', () => {
    const file = 'teste.txt';

    // Configurando o valor de retorno do mock para o teste
    mockFetch.mockRejectedValueOnce(new Error(`O ${file} não é um arquivo Markdown`));

    return mdlinks(file).catch(error => {
      expect(error.message).toEqual(`O ${file} não é um arquivo Markdown`);
    });
  });
});
