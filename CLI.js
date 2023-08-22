const mdLinks = require("./index");

mdLinks('teste.md')
  .then((conteudo) => {
    console.log(conteudo);

  })
  .catch((error) => {
    console.error(error);
  })
