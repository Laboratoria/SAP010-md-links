const fs = require('fs')
const fetch = require('cross-fetch')
const path = require('path')

// Função para extrair o texto do link
function extractLinks (text, filePath) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm // procura por padrões MD
  const links = []
  let match // Variável para armazenar o resultado de cada execução da expressão regular

  while ((match = regex.exec(text)) !== null) {
    const linkText = match[1] // O match[1] representa o texto do link (texto entre colchetes [])
    const linkHref = match[2] // O match[2] representa o href do link (URL entre parênteses ())

    // Cria um objeto representando o link encontrado, contendo as informações
    // de href (URL), text (texto do link) e file (caminho do arquivo onde foi encontrado)
    const link = { href: linkHref, text: linkText, file: filePath }
    links.push(link) // add no array links
  }

  return links
}
// Função para validar os links
function validateLinks (links) {
  const promises = links.map((link) => {
    return fetch(link.href) // percorrer cada link e realizar uma requisição HTTP(fetch)
      .then((response) => {
        link.status = response.status
        link.ok = response.ok ? 'OK' : 'FAIL'
        /* console.log(link)
        console.log(response.ok) */
        return link
      })
      .catch(() => {
        link.status = 404
        link.ok = 'FAIL'
        return link // Rejeita a promessa com o erro original(chamando os links com o erro)
      })
  })
  /* console.log(promises) */

  return Promise.all(promises)
  // As chamadas a fetch são encapsuladas em Promises e agrupadas usando Promise.all para obter um array de promessas que representa o resultado da validação de todos os links.
}

// Função para as estatísticas dos links
function statsLinks (links) {
  const linksSize = links.length
  // cria um novo array com map p/extrair href e Set para criar um conjunto de valores únicos (ou seja, remover duplicata)
  const uniqueLinks = [...new Set(links.map((link) => link.href))].length
  const brokenLinks = links.filter((link) => link.ok === 'FAIL').length
  return {
    total: linksSize,
    unique: uniqueLinks,
    broken: brokenLinks
  }
}

// Função para a leitura recursiva de diretórios
function readRecursion (absDirPath, fileCallback) {
  try {
    const files = fs.readdirSync(absDirPath)

    for (const file of files) { // Loop para percorrer cada arquivo encontrado no diretório
      const filePath = path.join(absDirPath, file) // absDirPath é o caminho absoluto do diretório - Constrói o caminho completo do arquivo com o file
      const stats = fs.statSync(filePath) // Obtém informações sobre o arquivo (se é um diretório, arquivo, etc.)

      if (stats.isDirectory()) {
        readRecursion(filePath, fileCallback)
      } else if (stats.isFile() && file.endsWith('.md')) {
        fileCallback(filePath)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// FUNÇÃO PRINCIPAL DO PROJETO - ler arquivo(s) e extrair os links
function fileRead (filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => { // para verificar se o caminho aponta para um diretório ou arquivo válido
      if (err) {
        // ENOENT - um arquivo ou diretório que não existe no sistema de arquivos.
        if (err.code === 'ENOENT') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`O arquivo ${filePath} não foi encontrado.`)
        }
      } else {
        if (stats.isDirectory()) { // se o caminho é um diretorio
          const markdownFiles = [] // criar array p/ armazenar arquivos MD
          readRecursion(filePath, (file) => { // Chama a função de leitura recursiva de diretórios para buscar os arquivos MD
            if (file.endsWith('.md')) {
              markdownFiles.push(file) // add no array
            }
          })
          // Cria um array de promessas para ler cada arquivo MD
          const promises = markdownFiles.map((file) => {
            return fs.promises
              .readFile(file, 'utf8')
              .then((data) => {
                const links = extractLinks(data, file) // Extrai os links do arquivo
                // Valida os links
                return validateLinks(links).then((validatedLinks) => {
                  // Calcula as estatísticas dos links
                  const statistics = statsLinks(validatedLinks)
                  // Retorna um objeto contendo o arquivo, os links validados e as estatísticas
                  return { file, links: validatedLinks, stats: statistics }
                })
              })
              .catch((error) => {
                throw error
              })
          })
          // Executa todas as promessas em paralelo usando Promise.all
          Promise.all(promises)
            .then((results) => {
              resolve(results) // Resolve a promessa com o resultado das leituras de arquivo
            })
            .catch((error) => {
              reject(error) // rejeita se tiver algum erro de leitura
            })
        } else if (stats.isFile() && filePath.endsWith('.md')) { // Se o caminho é um arquivo Markdown
          fs.readFile(filePath, 'utf8', (err, data) => { // Lê o conteúdo do arquivo
            if (err) {
              reject(err)
            } else {
              const links = extractLinks(data, filePath)
              validateLinks(links)
                .then((validatedLinks) => {
                  const statistics = statsLinks(validatedLinks) // Calcula as estatísticas dos links
                  resolve({ file: filePath, links: validatedLinks, stats: statistics }) // Resolve a promessa com o objeto contendo o arquivo, os links validados e as estatísticas
                })
                .catch((error) => {
                  reject(error)
                })
            }
          })
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`O caminho ${filePath} não é um arquivo Markdown válido.`)
        }
      }
    })
  })
}

module.exports = {
  fileRead,
  validateLinks,
  statsLinks,
  extractLinks,
  readRecursion
}
