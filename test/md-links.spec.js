const path = require('path');
const fetch = require('cross-fetch');
const { mdlinks, validateFetch, statisticsLinks } = require('../index.js');

jest.mock('cross-fetch', () => jest.fn()); // Cria um mock para a função 'fetch' usando o Jest

describe('validateFetch', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch);
  });

  
  describe('validateFetch', () => {
    it('Deve validar corretamente os links md', () => {
      const links = { text: 'Markdown', href: 'http://example.com', file: 'README.md' };

      // Simula uma resposta bem-sucedida da requisição HTTP
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
      });

      // Chama a função validateFetch com os links fornecidos e verifica se a resposta está correta
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

    // Simula uma falha na requisição HTTP
    mockFetch.mockRejectedValueOnce(('Request failed'));

    // Chama a função validateFetch com a URL fornecida e verifica se a resposta está correta
    return validateFetch(url).then((result) => {
      expect(result).toEqual({
        ...url,
        status: 'Request failed',
        ok: 'fail',
      });
    });
  });
});

describe('mdlinks', () => {
 it('Deve retornar uma mensagem informando que o arquivo não foi encontrado', () => {
    const filePath = 'C:\\Users\\raque\\Documents\\SAP010-md-links\\teste.txt';

  
    return mdlinks(filePath).catch((reject) => {
      expect(reject).toEqual(`O arquivo/diretório ${filePath} não foi encontrado no caminho especificado.`);
    });
  });

  it('Deve ler e extrair os links corretamente de um arquivo Markdown', () => {
    const filePath = 'arquivos/teste.md'; // Substitua com o caminho para um arquivo Markdown
    const expectedLinks = ({ "file": "teste.md", "href": "https://nodejs.org/", "text": "Node.js" })
  
  
    return mdlinks(filePath).then((result) => {
      expect(result.links[1]).toEqual(expectedLinks);
      
    });
  });


  it('Deve retornar as propriedades de um diretorio valido', () => {
    const filePath = 'arquivos/';
    const options = {};

    return mdlinks(filePath, options).then((result) => {
      expect(result).toHaveProperty('links');
      
      result.links.forEach((link) => {
        expect(link).toHaveProperty('text');
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('file');
      });
    });
  });

  it('Deve retornar uma mensagem informando que o arquivo não é um Markdown', () => {
    const file = 'arquivos/teste.txt';

    // Chama a função mdlinks com um arquivo que não é um Markdown e verifica se o erro é tratado corretamente
    return mdlinks(file).catch((error) => {
      expect(error).toEqual(`O ${file} não é um arquivo Markdown.`);
    });
  });

});

describe('statisticsLinks', () => {
  it('Deve calcular corretamente as estatísticas dos links', () => {
    const links = [
      {
        text: 'Link 1',
        href: 'https://www.link1.com',
        file: 'teste.md',
        ok: 'ok',
      },
      {
        text: 'Link 2',
        href: 'https://www.link2.com',
        file: 'teste.md',
        ok: 'fail',
      },
      {
        text: 'Link 3',
        href: 'https://www.link3.com',
        file: 'teste.md',
        ok: 'ok',
      },
    ];

    // Chama a função mdlinks com os l
    const statistics = statisticsLinks(links);

    expect(statistics.total).toBe(3);
    expect(statistics.unique).toBe(3);
    expect(statistics.broken).toBe(1);
  });
});  
