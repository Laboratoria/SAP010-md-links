/* eslint-disable no-undef */
/* const mdLinks = require('..'); */
const { fileRead, validateLinks, statsLinks } = require('../index');
/* const fetch = require('cross-fetch') */
/* const path = require('path');
 */

/* describe('mdlinks', () => {
  let mockFetch;
  beforeEach(() => {
    mockFetch = jest.fn();
    fetch.mockImplementation(mockFetch);
  })
}) */

// Mock para a função fetch
/* jest.mock('cross-fetch', () => {
  return jest.fn().mockImplementation((url) => {
    if (url === 'https://www.google.com') {
      return Promise.resolve({ status: 200, ok: true });
    } else if (url === 'https://www.github.com') {
      return Promise.resolve({ status: 404, ok: false });
    } else {
      return Promise.reject(new Error('Error Fetch'))
    }
  });
}); */

describe('Deve ler o arquivo e extrair os links corretamente', () => {
  test('Extração correta de links', () => {
    const filePath = './mdFiles/files.md'

    return fileRead(filePath).then((results) => {
      const fileResults = results[0]
      const links = fileResults.links.map((link) => ({
        href: link.href,
        text: link.text,
        file: fileResults.file
      }));

      return validateLinks(links).then((validatedLinks) => {
        const expectedLink = {
          href: 'https://www.google.com',
          text: 'Google',
          file: fileResults.file,
          status: 200,
          ok: 'OK',
        };
        expect(validatedLinks[0]).toEqual(expectedLink);
      });
    });
  });

  test('Deve retornar uma lista vazia para um arquivo sem links', () => {
    const filePath = './mdFiles/semLinks.md';

    return fileRead(filePath).then((results) => {
      const fileResults = results[0];
      const links = fileResults.links.map((link) => ({
        href: link.href,
        text: link.text,
        file: fileResults.file,
      }));

      return validateLinks(links).then((validatedLinks) => {
        expect(validatedLinks).toEqual([]);
      });
    });
  });

  test('Deve rejeitar com um erro ao ler um arquivo inexistente', () => {
    const filePath = './mdFiles/nonexistent.md';

    return fileRead(filePath).catch((error) => {
      expect(error).toEqual(`O arquivo ${filePath} não foi encontrado.`);
    });
  });
});

describe('mdlinks', () => {
  test('deve retornar o arquivo "./mdFiles/files.md"', () => {
    const filePath = './mdFiles/files.md';

    return fileRead(filePath).then((results) => {
      const fileResults = results[0];
      expect(fileResults.file).toBe(filePath);
    });
  });
});

describe('statsLinks', () => {
  test('deve retornar as estatísticas corretas para uma lista de links', () => {
    const links = [
      { href: 'https://www.google.com', text: 'Google', file: './mdFiles/files.md', status: 200, ok: 'OK' },
      { href: 'https://www.github.com', text: 'GitHub', file: './mdFiles/files.md', status: 404, ok: 'FAIL' },
    ];

    const statistics = statsLinks(links);

    expect(statistics.total).toBe(2);
    expect(statistics.unique).toBe(2);
    expect(statistics.broken).toBe(1);
  });
});
