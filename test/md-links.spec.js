const mdLinks = require('../index');
const readFileContent = require('../index');
const axios = require('axios');
const validateLinks = require('../index');

jest.mock('axios');


describe('testes da função mdLinks', () => {
  test('a função mdLinks deve resolver uma array de objetos', async () => {
    const funcaoMdLinks = await mdLinks('README.md');
    expect(typeof funcaoMdLinks).toBe('object');
  });

  test('a função deve chamar readFileContent', () => {
    const rota = 'teste.md';
    const readFileContent = jest.fn();
    readFileContent(rota);
    expect(readFileContent).toHaveBeenCalledTimes(1);
  });

  test('deve rejeitar se o arquivo estiver vazio', async () => {
    const fakeFile = 'arquivoinexist.md';
    return mdLinks(fakeFile).catch(error => {
      expect(error.message).toBe('Este arquivo não existe');
    });
  });

  test('deve rejeitar o arquivo diferente de md', async () => {
    const fakeMdFile = 'index.js';
    return mdLinks(fakeMdFile).catch(error => {
      expect(error.message).toBe('O arquivo não é um arquivo markdown');
    });
  });
})

describe('testes da função readFileContent', () => {
  test('deve rejeitar o arquivo vazio', async () => {
    const emptyFile = 'empty.md';
    return readFileContent(emptyFile).catch(error => {
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
      [{
        "file": "C:\\Users\\Janio\\SAP010-md-links\\teste.md",
        "href": "https://github.com/markedjs/marked",
        "ok": "fail",
        "status": undefined,
        "texto": "marked"
      },
      {
        "file": "C:\\Users\\Janio\\SAP010-md-links\\teste.md",
        "href": "https://linkquebrado.com",
        "ok": "fail",
        "status": undefined,
        "texto": "ss836ddgu"
      }]);
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
    expect(result).toEqual([{
      "file": "C:\\Users\\Janio\\SAP010-md-links\\teste.md",
      "href": "https://github.com/markedjs/marked",
      "ok": "fail",
      "status": "N/A",
      "texto": "marked"
    },
    {
      "file": "C:\\Users\\Janio\\SAP010-md-links\\teste.md",
      "href": "https://linkquebrado.com",
      "ok": "fail",
      "status": "N/A",
      "texto": "ss836ddgu"
    }])
  });
})