const path = require('path');
const {
  validateLink,
  fileMD,
  readAndExtractLinks,
  readDir,
  mdLinks,
} = require('../src/md-links.js');

// Caminhos para os arquivos de teste
const noLinksPath = path.resolve(__dirname, 'test-files', 'link-fail.md');
const linksPath = path.resolve(__dirname, 'test-files', 'link-ok.md');
const invalidPath = path.resolve(__dirname, 'test-files', 'file-invalid.html');

// Testes para a função mdLinks
describe('mdLinks - Caminho inválido', () => {
  test('Rejeita com erro quando o caminho não é um arquivo nem diretório válido', () => {
    return mdLinks(invalidPath).catch((error) => {
      expect(error).toEqual(expect.any(Error));
      expect(error.message).toEqual('Caminho do arquivo inválido, a extensão precisa ser ".md"');
    });
  });
});

describe('mdLinks - Sem links', () => {
  test('Resolve com um array vazio quando nenhum link é encontrado no arquivo', () => {
    return mdLinks(noLinksPath).then((links) => {
      expect(links).toEqual([]);
    });
  });
});

describe('mdLinks - Links Corretos', () => {
  test('Resolve com os links corretos em um arquivo com links', () => {
    const expectedLinks = [
      { href: 'https://www.example.com', text: 'Example' },
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'https://developer.mo', text: 'mozilla' },
    ];
    return mdLinks(linksPath).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });
});

describe('mdLinks - Links Quebrados', () => {
  test('Testar o comportamento quando o arquivo contém links inválidos ou mal formatados.', () => {
    return mdLinks(linksPath).catch((error) => {
      expect(error).toEqual(expect.any(Error));
    });
  });
});

// Teste para verificar se o arquivo é de extensão .md
describe('fileMD', () => {
  test('Verificar se o arquivo é de extensão .md', () => {
    const isMDFile = fileMD(linksPath);
    expect(isMDFile).toBe(true);
  });
});

// Teste para a função validateLink
describe('validateLink', () => {
  test('Validar um link existente', () => {
    const link = {
      href: 'https://www.example.com',
      text: 'Example',
    };

    return validateLink(link).then((result) => {
      expect(result.href).toEqual(link.href);
      expect(result.text).toEqual(link.text);
      expect(result.status).toEqual(200);
      expect(result.ok).toEqual(true);
    });
  });

  test('Rejeita com erro quando o link é inválido', () => {
    const link = {
      href: 'https://www.notfound.com',
      text: 'Not Found',
    };

    return validateLink(link).then((result) => {
      expect(result.href).toEqual(link.href);
      expect(result.text).toEqual(link.text);
      expect(result.status).toEqual(404);
      expect(result.ok).toEqual(false);
    });
  });
});

// Teste para arquivo
describe('readAndExtractLinks', () => {
  test('Traz os links de um arquivo Markdown', () => {
    const expectedLinks = [
      { href: 'https://www.example.com', text: 'Example' },
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'https://developer.mo', text: 'mozilla' },
    ];

    return readAndExtractLinks(linksPath).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });

  test('Rejeita com erro quando ocorre um erro na leitura do arquivo', () => {
    return readAndExtractLinks(invalidPath).catch((error) => {
      expect(error).toBeInstanceOf(Error);
    });
  });
});

// Teste para diretório
describe('readDir', () => {
  test('Traz os links dos arquivos Markdown de um diretório', () => {
    const expectedLinks = [
      { href: 'https://www.example.com', text: 'Example' },
      { href: 'https://www.google.com', text: 'Google' },
      { href: 'https://developer.mo', text: 'mozilla' },
    ];

    return readDir(path.resolve(__dirname, 'test-files')).then((links) => {
      expect(links).toEqual(expectedLinks);
    });
  });

  test('Rejeita com erro quando ocorre um erro ao ler o diretório', () => {
    return readDir(invalidPath).catch((error) => {
      expect(error).toBeInstanceOf(Error);
    });
  });
});
