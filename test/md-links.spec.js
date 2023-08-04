const {lerArquivos, validateLinks, getStats} = require('../src/index');
const path = require('path');
const fs = require('fs');

describe('lerArquivos', () => {
  it ('deve retornar um array vazio quando o arquivo não tem links',() => {
    return lerArquivos('./src/arquivos/vazio.md').then((result)=> {
      expect(result).toEqual([]);
    });
  });
});

it ('deve retornar um array com informações quando o arquivo tiver links',() => {
  const filePath = path.resolve(__dirname, '../src/arquivos/arquivo.md');
  return lerArquivos(filePath).then((result)=> {
    expect(result).toEqual([
      {
        text: 'Google',
        url: 'https://www.google.com/',
        file: filePath,
      },
      {
        text: 'MDN Docs',
        url: 'https://developer.mozilla.org/pt-BR/',
        file: filePath,
      },
      {
        text: 'w3 school',
        url: 'https://www.w3schools.com/',
        file: filePath,
      },
      {
        text: 'FreeCodeCamp',
        url: 'https://www.freecodecamp.org/',
        file: filePath,
      },
      {
        text: 'RegexOne',
        url: 'https://regexone.com/',
        file: filePath,
      },
      {
        text: 'Learngit',
        url: 'https://learngitbranching.js.org/?locale=pt_BR',
        file: filePath,
      },
      {
        text: 'npm',
        url: 'https://www.npmjssss.com/package/cross-fetch?activeTab=readme',
        file: filePath,
      },
      {
        text: 'RegexOne',
        url: 'https://regexone.com/',
        file: filePath,
      },
     ]);
  });
});

describe('validateLinks', () => {
  it('deve validar links corretamente', (done) => {
    const mockArrayLinks = [
      { url: 'http://example.com', text: 'Exemplo 1' },
      { url: 'http://invalid-url', text: 'Link Inválido' }
    ];

    const mockResponseSuccess = {
      status: 200,
      ok: true
    };

    const mockResponseFail = {
      status: 404,
      ok: false
    };

    // Mock do fetch para retornar a resposta desejada
    const fetchMock = jest.fn((url) => {
      if (url === 'http://example.com') {
        return Promise.resolve(mockResponseSuccess);
      } else {
        return Promise.reject(mockResponseFail);
      }
    });

    global.fetch = fetchMock;

    validateLinks(mockArrayLinks).then((result) => {
      expect(result).toEqual([
        { url: 'http://example.com', text: 'Exemplo 1', status: 200, ok: 'ok' },
        { url: 'http://invalid-url', text: 'Link Inválido', status: 404, ok: 'fail' }
      ]);
      done();
    }).catch(done.fail);
  });
});

describe('getStats', () => {
  it('Mostrar total de links e links únicos quando der o --stats', () => {
    const mockArrayLinks = [
      { url: 'https://www.google.com/' },
      { url: 'https://developer.mozilla.org/pt-BR/' },
      { url: 'https://www.w3schools.com/' },
      { url: 'https://www.freecodecamp.org/' },
      { url: 'https://regexone.com/' },
      { url: 'https://learngitbranching.js.org/?locale=pt_BR' },
      { url: 'https://www.npmjssss.com/package/cross-fetch?activeTab=readme' },
      { url: 'https://regexone.com/' },
    ];

    const options = {
      validate: false,
      stats: true,
    };

    const result = {
      totalLinks: 8,
      uniqueLinks: 7,
    };

    const res = getStats(mockArrayLinks, options);
    expect(res).toEqual(result);
  });
});