#!/usr/bin/env node
const program = require('commander')
const { fileRead, validateLinks, statsLinks } = require('./index')
const packageJson = require('./package.json')

program.version(packageJson.version)

program
  .version('1.0.0')
  .description('Uma ferramenta para extrair e validar links em arquivos Markdown.')
  .option('--validate', 'Validar os links encontrados')
  .option('--stats', 'Exibir estatísticas dos links')
  .arguments('<path>')
  .action((path, options) => {
    fileRead(path)
      .then(({ links }) => {
        if (options.validate && options.stats) {
          return validateLinks(links)
            .then((validatedLinks) => {
              const statistics = statsLinks(validatedLinks)
              console.log(`Links total: ${statistics.total}`)
              console.log(`Unique links: ${statistics.unique}`)
              console.log(`Broken links: ${statistics.broken}`)
              console.log('-------------------------------')
            })
        } else if (options.validate) {
          links.forEach((link) => {
            console.log(`href: ${link.href}`)
            console.log(`Text: ${link.text}`)
            console.log(`Status: ${link.ok}`)
            console.log(`File: ${link.file}`)
            console.log('-------------------------------')
          })
        } else if (options.stats) {
          /* return statsLinks(links) */
          const statistics = statsLinks(links)
          console.log(`Links total: ${statistics.total}`)
          console.log(`Unique links: ${statistics.unique}`)
          console.log('-------------------------------')
        } else {
          links.forEach((link) => {
            console.log(`href: ${link.href}`)
            console.log(`Text: ${link.text}`)
            console.log(`File: ${link.file}`)
            console.log('-------------------------------')
          })
        }
      })
      .catch((error) => {
        console.error('Erro:', error)
      })
  })
  .parse(process.argv)
