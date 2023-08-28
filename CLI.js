const { mdLinks } = require("./index");

const validate = true;

mdLinks('arquivos-md', validate)
  .then((conteudo) => {
    console.log(conteudo);

  })
  .catch((error) => {
    console.error(error);
  })
