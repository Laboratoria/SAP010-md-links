const { mdLinks } = require('./md-links.js'); // Altere o caminho para o arquivo md-links.js conforme necessário

const filePath = './src/file/file.md'; // Substitua pelo caminho correto do arquivo que deseja analisar

const options = {
  validate: true, // Substitua por `false` se não quiser validar os links
};

mdLinks(filePath, options)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

/* const statsFunction = (arrayLinks) => {
  return new Promise((resolve) => {
    const hrefList = [];
    let broken = 0;
    arrayLinks.forEach((element) => {
      hrefList.push(element.href);
      // Adicionamos a URL de cada link no array 'hrefList'.
      if (element.ok === false) {
        broken += 1;
      // Se o link estiver quebrado (com a propriedade 'ok' igual a false),
      // incrementamos a variável 'broken'.
      }
    });
    const uniqueLinks = new Set(hrefList);
    // Criamos um conjunto a partir do array 'hrefList', para obter somente os links únicos.
    const objStats = {
      total: hrefList.length,
      // A propriedade 'total' terá o número total de links encontrados.
      unique: uniqueLinks.size,
      // A propriedade 'unique' terá o número de links únicos (sem repetições).
      broken,
      // A propriedade 'broken' terá a quantidade de links quebrados.
    };
    resolve(objStats);
    // Resolvemos a promessa com o objeto 'objStats'.
  });
};

const getLinks = (fileData) => {
  return new Promise((resolve, reject) => {
    const textFile = fileData.data;
    // Armazenamos o conteúdo do arquivo na variável 'textFile'.
    const regexLink = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    // Definimos uma expressão regular (regex) para encontrar links no formato [texto](url).
    const matchLinks = textFile.match(regexLink);
    // Procuramos todos os links no conteúdo do arquivo usando a expressão regular.
    if (matchLinks !== null) {
      // Se encontrarmos algum link:
      const arrayLinks = matchLinks.map((link) => {
        const removePunctuation = link.replace(/.$/, '').replace(/^./, '');
        // Removemos os caracteres finais do link para obter somente a URL.
        const splitExpression = removePunctuation.split('](');
        // Separamos o texto do link da URL.
        const objLinks = {
          href: splitExpression[1],
          // Armazenamos a URL no objeto 'objLinks'.
          text: splitExpression[0],
          // Armazenamos o texto do link no objeto 'objLinks'.
          file: fileData.file,
          // Armazenamos o caminho do arquivo no objeto 'objLinks'.
        };
        return objLinks;
        // Retornamos o objeto 'objLinks' contendo as informações do link.
      });
      resolve(arrayLinks);
      // Resolvemos a promessa com o array de links 'arrayLinks'.
    } else {
      // Caso não encontremos nenhum link no conteúdo do arquivo:
      const errorMessage = `Não há links no arquivo ou o arquivo está vazio: ${fileData.file}`;
      // Criamos uma mensagem de erro informando que não há links no arquivo.
      reject(errorMessage);
      // Rejeitamos a promessa com a mensagem de erro.
    }
  });
};

const validateFunction = (arrayLinks) => {
  const promiseArray = arrayLinks.map((element) => {
    return new Promise((resolve) => {
      fetch(element.href)
      // Fazemos uma requisição HTTP usando a função 'fetch' para obter informações do link.
        .then((objlink) => {
          const objLinkFetch = {
            href: element.href,
            // Armazenamos a URL do link no objeto 'objLinkFetch'.
            text: element.text,
            // Armazenamos o texto do link no objeto 'objLinkFetch'.
            file: element.file,
            // Armazenamos o caminho do arquivo no objeto 'objLinkFetch'.
            status: objlink.status,
            // Armazenamos o status da resposta HTTP no objeto 'objLinkFetch'.
            ok: objlink.ok,
            // Armazenamos se o link é válido (true) ou não (false) no objeto 'objLinkFetch'.
          };
          resolve(objLinkFetch);
          // Resolvemos a promessa com o objeto 'objLinkFetch' contendo as informações do link.
        })
        .catch((erro) => {
          const objLinkFetch = {
            href: element.href,
            // Armazenamos a URL do link no objeto 'objLinkFetch'.
            text: element.text,
            // Armazenamos o texto do link no objeto 'objLinkFetch'.
            file: element.file,
            // Armazenamos o caminho do arquivo no objeto 'objLinkFetch'.
            status: erro.code ? erro.code : 'NÃO_ENCONTRADO',
            // Armazenamos o status da resposta HTTP (ou 'NÃO_ENCONTRADO' se ocorrer algum erro)
            // no objeto 'objLinkFetch'.

            ok: false,
            // Definimos 'ok' como falso, indicando que o link não é válido.
          };

          resolve(objLinkFetch);
          // Resolvemos a promessa com o objeto 'objLinkFetch' contendo as informações do link
          // (mesmo em caso de erro).
        });
    });
  });

  return Promise.all(promiseArray);
  // Retorna uma promessa que será resolvida quando todas as promessas individuais
  // no array 'promiseArray' forem resolvidas.
};

module.exports = {
  statsFunction,
  validateFunction,
  getLinks,
}; */
