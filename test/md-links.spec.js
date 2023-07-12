/* eslint-disable no-undef */
const { fileRead, validateLinks, statsLinks, extractLinks } = require('../index')

describe('Deve ler o arquivo e extrair os links corretamente', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  test('Extração correta de links', () => {
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
})

describe('extractLinks', () => {
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

describe('statsLinks', () => {
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

test('Deve validar corretamente os links e lidar com falhas na requisição', () => {
  const links = [
    { href: 'https://exemplo.com/link1' },
    { href: 'https://exemplo.com/link2' },
    { href: 'https://exemplo.com/link3' }
  ]

  // Simula a falha na requisição HTTP
  global.fetch.mockRejectedValue(new Error('Falha na requisição'))

  return validateLinks(links).then((validatedLinks) => {
    const expectedLinks = [
      { href: 'https://exemplo.com/link1', status: 404, ok: 'FAIL' },
      { href: 'https://exemplo.com/link2', status: 404, ok: 'FAIL' },
      { href: 'https://exemplo.com/link3', status: 404, ok: 'FAIL' }
    ]

    expect(validatedLinks).toEqual(expectedLinks)
  })
})
