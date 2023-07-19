/* eslint-disable no-undef */
/* const fs = require('fs') */
const {
  fileRead,
  validateLinks,
  statsLinks,
  extractLinks,
  readRecursion
} = require('../index')

describe('Funções de Validação de Links', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  describe('Função validateLinks', () => {
    test('Deve validar corretamente os links e lidar com falhas na requisição', () => {
      const links = [
        { href: 'https://example.com/link1' },
        { href: 'http://google.com' }
      ]

      const mockResponse = { status: 200, ok: true }
      global.fetch.mockResolvedValue(mockResponse)

      // Aumentar o limite de tempo para 10 segundos
      jest.setTimeout(10000)

      return validateLinks(links).then((validatedLinks) => {
        const expectedLinks = [
          {
            href: 'https://example.com/link1',
            status: 404,
            ok: 'FAIL'
          },
          {
            href: 'http://google.com',
            status: 200,
            ok: 'OK'
          }
        ]

        expect(validatedLinks).toEqual(expectedLinks)
      })
    })

    test('Deve rejeitar com um erro ao validar os links', () => {
      const links = [
        { href: 'https://example.com/link1' },
        { href: 'https://example.com/link2' }
      ]

      global.fetch.mockRejectedValue()

      return validateLinks(links).then((validatedLinks) => {
        expect(validatedLinks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ ok: 'FAIL', status: 404 }),
            expect.objectContaining({ ok: 'FAIL', status: 404 })
          ])
        )
      })
    })

    test('Deve lidar corretamente com uma lista vazia de links', () => {
      const links = []

      return validateLinks(links).then((validatedLinks) => {
        expect(validatedLinks).toEqual([])
      })
    })
  })

  describe('Função fileRead', () => {
    test('Deve rejeitar com um erro ao ler um arquivo não Markdown', () => {
      const filePath = './mdFiles/text.txt'

      return expect(fileRead(filePath)).rejects.toEqual(
        `O caminho ${filePath} não é um arquivo Markdown válido.`
      )
    })

    test('Deve ler o arquivo e extrair os links corretamente', () => {
      const filePath = './mdFiles/files.md'
      const mockResponse = { status: 200, ok: true }

      global.fetch.mockResolvedValue(mockResponse)

      return fileRead(filePath).then((results) => {
        const fileResults = results[0]
        const links = fileResults && fileResults.links
          ? fileResults.links.map((link) => ({
            href: link.href,
            text: link.text,
            file: fileResults.file
          }))
          : []

        return validateLinks(links).then((validatedLinks) => {
          const expectedLinks = links.map((link) => ({
            ...link,
            status: 200,
            ok: 'OK'
          }))

          expect(validatedLinks).toEqual(expectedLinks)
        })
      })
    })

    test('Deve retornar uma lista vazia para um arquivo sem links', () => {
      const filePath = './mdFiles/semLinks.md'

      return fileRead(filePath).then((results) => {
        const fileResults = results[0]
        const links = fileResults && fileResults.links
          ? fileResults.links.map((link) => ({
            href: link.href,
            text: link.text,
            file: fileResults.file,
            status: link.status,
            ok: link.ok
          }))
          : []

        return validateLinks(links).then((validatedLinks) => {
          const statistics = statsLinks(validatedLinks)

          expect(validatedLinks).toEqual([])
          expect(statistics).toEqual({ total: 0, unique: 0, broken: 0 })
        })
      })
    })

    test('Deve rejeitar com um erro ao ler um arquivo inexistente', () => {
      const filePath = './mdFiles/nonexistent.md'

      return expect(fileRead(filePath)).rejects.toEqual(
        `O arquivo ${filePath} não foi encontrado.`
      )
    })

    test('Deve lidar corretamente com erros de leitura de arquivos', () => {
      const filePath = './mdFiles/nonexistent.md'

      return fileRead(filePath).catch((error) => {
        expect(error).toEqual(`O arquivo ${filePath} não foi encontrado.`)
      })
    })
  })

  describe('Função extractLinks', () => {
    test('Deve extrair corretamente os links de um texto', () => {
      const text = 'Este é um exemplo de [link](https://exemplo.com) em um texto.'
      const filePath = 'example.md'
      const expectedLinks = [
        {
          href: 'https://exemplo.com',
          text: 'link',
          file: filePath
        }
      ]

      const links = extractLinks(text, filePath)

      expect(links).toEqual(expectedLinks)
    })
  })

  describe('Função statsLinks', () => {
    test('Deve retornar as estatísticas corretas para os links', () => {
      const links = [
        { href: 'https://exemplo.com/link1', ok: 'OK' },
        { href: 'https://exemplo.com/link2', ok: 'OK' },
        { href: 'https://exemplo.com/link3', ok: 'FAIL' },
        { href: 'https://exemplo.com/link4', ok: 'OK' }
      ]

      const statistics = statsLinks(links)

      expect(statistics.total).toBe(4)
      expect(statistics.unique).toBe(4)
      expect(statistics.broken).toBe(1)
    })

    test('Deve retornar estatísticas vazias para uma lista vazia de links', () => {
      const links = []

      const statistics = statsLinks(links)

      expect(statistics.total).toBe(0)
      expect(statistics.unique).toBe(0)
      expect(statistics.broken).toBe(0)
    })
  })
})
describe('Função readRecursion', () => {
  test('Deve chamar a função de callback para cada arquivo Markdown no diretório', () => {
    const path = require('path')
    const testDirPath = path.resolve(__dirname, 'mockDir')

    const callback = jest.fn()

    readRecursion(testDirPath, callback)

    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(path.normalize(`${testDirPath}/file1.md`))
    expect(callback).toHaveBeenCalledWith(path.normalize(`${testDirPath}/file2.md`))
    expect(callback).toHaveBeenCalledWith(path.normalize(`${testDirPath}/file3.md`))
  })
})
