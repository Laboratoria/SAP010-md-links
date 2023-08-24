const mdLinks = require("./index");

const validate = true;

mdLinks('teste.md', validate)
  .then((conteudo) => {
    console.log(conteudo);

  })
  .catch((error) => {
    console.error(error);
  })
