import mdlinks from '../src/lib/index.js';
import path from 'path';

describe('mdlinks', () => {
  it('Deve retornar os links de um arquivo Markdown', () => {
    const filePath = 'src/pag/teste.md';
    return mdlinks(filePath).then(links => {
      expect(links[0]).toEqual(
        { text: 'Markdown', href: 'https://pt.wikipedia.n', file: 'teste.md' },
      );
    });
  });

  it('Deve retornar o arquivo "teste.md"', () => {
    const filePath = 'src/pag/teste.md';
    return mdlinks(filePath).then((links) => {
      expect(links[0].file).toBe(path.basename(filePath));
    });
  });
  
  it('Deve retornar um array vazio para um arquivo que não seja Markdown', () => {
    const filePath = 'src/pag/arquivo.txt';
    return mdlinks(filePath).then(links => {
      expect(links).toEqual([]);
    });
  });
});


