/* eslint-disable no-undef */
/* const { fileRead } = require('../index.js') */

// Mock da função fileRead
/* jest.mock('../index.js', () => ({
  fileRead: jest.fn()
}))

describe('Deve ler o arquivo e extrair os links corretamente', () => {
  test('Extração correta de links', () => {
    const filePath = './files.md'
    const expectedLinks = [
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: filePath
      },
      {
        href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
        text: 'Arranjos',
        file: filePath
      },
      {
        href: 'https://developer.mozilla.org//pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
        text: 'Array - MDN',
        file: filePath
      }
    ]

    // Definindo o comportamento do mock
    fileRead.mockResolvedValue(expectedLinks)

    return fileRead(filePath).then((links) => {
      expect(links[0]).toEqual(expectedLinks[0])
      expect(links[1]).toEqual(expectedLinks[1])
      expect(links[2]).toEqual(expectedLinks[2])
    })
  })

  test('Deve retornar uma lista vazia para um arquivo sem links', () => {
    const filePath = './semLinks.md'

    // Definindo o comportamento do mock
    fileRead.mockResolvedValue([])

    return fileRead(filePath).then((links) => {
      expect(links).toEqual([])
    }).catch((error) => {
      expect(error).toEqual(`O arquivo ${filePath} não contém links.`);
    })
  })

  test('Deve rejeitar com um erro ao ler um arquivo inexistente', () => {
    const filePath = './arquivo_inexistente.md'

    // Definindo o comportamento do mock
    fileRead.mockRejectedValue(`O arquivo ${filePath} não foi encontrado.`);

    return fileRead(filePath).catch((error) => {
      expect(error).toEqual(`O arquivo ${filePath} não foi encontrado.`);
    })
  })
})

describe('mdlinks', () => {
  test('deve retornar o arquivo "./files.md"', () => {
    const file = './files.md'
    const filePath = './files.md'
    const expectedLinks = [
      {
        href: 'https://www.google.com',
        text: 'Google',
        file: file
      },
      {
        href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
        text: 'Arranjos',
        file: file
      },
      {
        href: 'https://developer.mozilla.org//pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
        text: 'Array - MDN',
        file: file
      }
    ]

    // Definindo o comportamento do mock
    fileRead.mockResolvedValue(expectedLinks)

    return fileRead(filePath).then((result) => {
      result.forEach((links) => {
        expect(links.file).toBe(file)
      })
    })
  })
})
 */

/*
const { fileRead } = require('../index.js')

describe('Deve ler o arquivo e extrair os links corretamente', () => {
  test('Extração correta de links', () => {
    const filePath = './files.md'

    return fileRead(filePath).then(links => {
      expect(links[0]).toEqual({
        href: 'https://www.google.com',
        text: 'Google',
        file: filePath
      })
      expect(links[1]).toEqual({
        href: 'https://curriculum.laboratoria.la/pt/topics/javascript/04-arrays',
        text: 'Arranjos',
        file: filePath
      })
      expect(links[2]).toEqual({
        href: 'https://developer.mozilla.org//pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/',
        text: 'Array - MDN',
        file: filePath
      })
    })
  })
  test('Deve retornar uma lista vazia para um arquivo sem links', () => {
    const filePath = './semLinks.md'

    return fileRead(filePath).then((links) => {
      expect(links).toEqual([])
    }).catch((error) => {
      expect(error).toEqual(`O arquivo ${filePath} não contém links.`)
    })
  })

  test('Deve rejeitar com um erro ao ler um arquivo inexistente', () => {
    const filePath = './arquivo_inexistente.md'

    return fileRead(filePath).catch((error) => {
      expect(error).toEqual(`O arquivo ${filePath} não foi encontrado.`)
    })
  })
})

describe('mdlinks', () => {
  test('deve retornar o arquivo "./files.md"', () => {
    const file = './files.md'
    const filePath = './files.md'
    return fileRead(filePath).then((result) => {
      result.forEach((links) => {
        expect(links.file).toBe(file)
      })
    })
  })
}) */
