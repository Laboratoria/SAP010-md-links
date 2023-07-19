#!/usr/bin/env node
const program = require('commander')
const { fileRead, validateLinks, statsLinks } = require('./index')
const packageJson = require('./package.json')
const colors = require('colors')
const { table } = require('table')

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
              console.log('-------------------------------')
              console.log(colors.green(`Total links: ${statistics.total}`))
              console.log(colors.yellow(`Unique links: ${statistics.unique}`))
              console.log(colors.red(`Broken links: ${statistics.broken}`))
              console.log('-------------------------------')
            })
        } else if (options.validate) {
          const data = [['href', 'text', 'status', 'file']]
          links.forEach((link) => {
            data.push([
              colors.blue(link.href),
              colors.magenta(link.text),
              colors.yellow(link.ok + ' / ' + link.status),
              colors.green(link.file)
            ])
          })
          const tableConfig = {
            columns: {
              0: { alignment: 'left' },
              1: { alignment: 'left' },
              2: { alignment: 'left' },
              3: { alignment: 'left' }
            }
          }
          const tableOutput = table(data, tableConfig)
          console.log(tableOutput)
        } else if (options.stats) {
          const statistics = statsLinks(links)
          console.log('-------------------------------')
          console.log(colors.green(`Links total: ${statistics.total}`))
          console.log(colors.yellow(`Unique links: ${statistics.unique}`))
          console.log('-------------------------------')
        } else {
          const data = [['href', 'text', 'file']]
          links.forEach((link) => {
            data.push([link.href, link.text, link.file])
          })
          const tableConfig = {
            columns: {
              0: { alignment: 'left' },
              1: { alignment: 'left' },
              2: { alignment: 'left' }
            }
          }
          const tableOutput = table(data, tableConfig)
          console.log(tableOutput)
        }
      })
      .catch((error) => {
        console.error('Erro:', error)
      })
  })
  .parse(process.argv)
