const path = require('path');
const { mdLinks } = require('../src/md-links.js');

const noLinksPath = path.resolve(__dirname, 'test-files', 'no-links.md');
const linksPath = path.resolve(__dirname, 'test-files', 'links.md');

test('Teste do md-links.js: resolve com um array vazio quando nenhum link é encontrado no arquivo', () => {
  return mdLinks(noLinksPath).then((links) => {
    expect(links).toEqual([]);
  });
});

test('Teste do md-links.js: resolve com os links corretos em um arquivo com links', () => {
  const expectedLinks = [
    { href: 'https://www.example.com', text: 'Example' },
    { href: 'https://www.google.com', text: 'Google' },
  ];

  return mdLinks(linksPath).then((links) => {
    expect(links).toEqual(expectedLinks);
  });
});
