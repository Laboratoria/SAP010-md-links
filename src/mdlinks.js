const fs = require('fs')

let filePath = '/home/cristyna/laboratoria/SAP010-md-links/src/test.txt'

fs.readFile(filePath, (err, fileContent) => {
    if (err) {
        console.error('Erro', err)
    } else {
        console.log(fileContent.toString())
    }
})