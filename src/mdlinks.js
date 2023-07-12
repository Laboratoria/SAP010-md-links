const fs = require('fs')

let filePath = process.argv[2]

fs.readFile(filePath, (err, fileContent) => {
    if (err) {
        console.error('Erro', err)
    } else {
        console.log(fileContent.toString())
    }
})