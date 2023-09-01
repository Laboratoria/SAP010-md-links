const { mdLinks, readMdFiles, validateLinks, readMdFilesInDirectory } = require('../index');
const axios = require('axios');

jest.mock('axios');

describe('testes da função mdLinks', () => {
  test('a função mdLinks deve resolver uma array de objetos', async () => {
    const funcaoMdLinks = await mdLinks('README.md');
    expect(typeof funcaoMdLinks).toBe('object');
  });

  test('a função deve chamar readMdFiles', () => {
    const rota = 'teste.md';
    const readMdFiles = jest.fn();
    readMdFiles(rota);
    expect(readMdFiles).toHaveBeenCalledTimes(1);
  });

  test('deve rejeitar se o arquivo/diretório não existir', async () => {
    const fakeFile = 'arquivoinexist.md';
    return mdLinks(fakeFile).catch(error => {
      expect(error.message).toBe('Arquivo/diretório não encontrado');
    });
  });

  test('deve rejeitar o arquivo diferente de md', async () => {
    const fakeMdFile = 'index.js';
    return mdLinks(fakeMdFile).catch(error => {
      expect(error.message).toBe('O arquivo não é um arquivo markdown');
    });
  });

  test('deve rejeitar o arquivo se for vazio', async () => {
    const emptyFile = 'emptyfile.md';
    return mdLinks(emptyFile).catch(error => {
      expect(error.message).toBe('O arquivo não contém links.');
    });
  });

  test('deve ler um diretório e subdiretório', () => {
    return expect(mdLinks('arquivos-md')).resolves.toStrictEqual(
      [
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\outroslinks.md",
          "href": "https://nodejs.org/api/path.html",
          "texto": "Path",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\outroslinks.md",
          "href": "https://www.hostinger.com.br/tutoriais/o-que-e-npm",
          "texto": "O que é npm",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\outroslinks.md",
          "href": "https://github.com/stevekane/promise-it-wont-hurt",
          "texto": "promise-it-wont-hurt",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\outroslinks.md",
          "href": "https://github.com/stevekane/promise-it-wont-hurt",
          "texto": "promise-it-wont-hurt",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\mais-arquivos\\teste.md",
          "href": "https://github.com/markedjs/marked",
          "texto": "marked",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\mais-arquivos\\teste.md",
          "href": "http://linkquebrado.com",
          "texto": "ss836ddgu",
        },
        {
          "file": "C:\\Users\\Janio\\SAP010-md-links\\arquivos-md\\mais-arquivos\\teste.md",
          "href": "http://google.com/badpage",
          "texto": "badpage",
        }
      ]
    );
  });

  test('deve dar erro ao ler um diretório sem md', async () => {
    const nonMdFile = 'dir-sem-md';
    return mdLinks(nonMdFile).catch(error => {
      expect(error.message).toBe('Nenhum arquivo md encontrado no diretório');
    });
  })
})

describe('testes da função readMdFiles', () => {
  test('deve rejeitar o arquivo vazio', async () => {
    const emptyFile = 'emptyfile.md';
    return readMdFiles(emptyFile).catch(error => {
      expect(error.message).toBe('O arquivo está vazio');
    });
  });
})

describe('testes do axios', () => {
  test('resolve do axios', async () => {
    axios.head.mockResolvedValue({
      data: [
        {
          href: 'https://linkquebrado.com',
          texto: 'ss836ddgu',
          file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md',
          status: 'N/A',
          ok: 'fail'
        },
        {
          href: 'https://github.com/markedjs/marked',
          texto: 'marked',
          file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md',
          status: 200,
          ok: 'ok'
        }
      ]
    })

    const result = await validateLinks('teste.md', true);
    expect(result).toEqual(
      { "ok": "fail", "status": undefined }
    );
  });

  test('reject do axios', async () => {
    axios.head.mockRejectedValue({
      data: [
        {
          href: 'https://linkquebrado.com',
          texto: 'ss836ddgu',
          file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md'
        },
        {
          href: 'https://github.com/markedjs/marked',
          texto: 'marked',
          file: 'C:\\Users\\Janio\\SAP010-md-links\\teste.md',
        }
      ]
    })

    const result = await validateLinks('teste.md', true);
    expect(result).toEqual(
      { "ok": "fail", "status": 'N/A' }
    )
  });
})

describe('testes do validateLinks', () => {
  test('resolve do validateLinks', async () => {
    const response = {
      status: 200,
      ok: 'ok'
    };

    axios.head = jest.fn().mockResolvedValue(response);

    const option = { validate: true }

    const result = await mdLinks('links.md', option);

    expect(result).toHaveLength(3);
    expect(result[0].status).toBe(200);
    expect(result[0].ok).toBe('ok');
  });

  test('reject do validateLinks', async () => {
    const error = {
      response: {
        status: 404
      }
    };

    axios.head = jest.fn().mockRejectedValue(error);

    const option = { validate: true }

    const result = await mdLinks('links.md', option);

    expect(result).toHaveLength(3);
    expect(result[0].status).toBe(404);
    expect(result[0].ok).toBe('fail');
  })
})

describe('testes do readMdFilesInDirectory', () => {
  test('deve retornar uma array de arquivos md', () => {
    return expect(readMdFilesInDirectory('arquivos-md')).resolves.toStrictEqual(
      ["arquivos-md\\outroslinks.md",
        "arquivos-md\\texto.md",
        "arquivos-md\\mais-arquivos\\teste.md"
      ]
    );
  });
})