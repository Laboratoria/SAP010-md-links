# Markdown Links

## Índice

* [1. Resumo](#1-prefácio)
* [2. Instalação da biblioteca ](#2-instalação-do-biblioteca)
* [3. Fluxograma](#3-fluxograma)
* [4. Instrução de uso](#4-instrução-de-uso)
* [5. Tecnologias utilizadas](#5-tecnologias-utilizadas)


***

## 1. Resumo
**Markdown** é uma linguagem de marcação muito popular e amplamente utilizada entre programadores e escritores online. Ela foi projetada para ser de fácil leitura e escrita, permitindo a conversão para HTML e outros formatos de apresentação.

No projeto *'Markdown Links'*, desenvolvido durante o bootcamp da Laboratoria, foi criada uma biblioteca em Node.js com o objetivo de ler arquivos Markdown (.md) e verificar os links contidos neles. O foco principal desse projeto foi aprimorar o conhecimento em manipulação de arquivos, trabalhar com a CLI (command-line interface) e obter estatísticas sobre os links encontrados. Com essa biblioteca, tornou-se mais simples e eficiente realizar a validação de links em arquivos Markdown."
## 2.  Instalação da biblioteca
Para instalar a biblioteca, execute o seguinte comando no terminal:
### 🔹npm install md-links-raquel-maia
## 3.  Fluxograma
<img src= ".\fluxo-f.png" width ="950px" height ="550px"/> 

## 4. Instrução de uso 

🟣 Listagem de Links 

Comando 1 > **md-links ./caminhoDaPasta/nomeDoArquivo.md** 

Esse comando procura arquivos na rota especificada, e imprime através de uma tabela os links extraídos, juntamente com o texto descritivo do link e a rota do arquivo em que cada link foi encontrado, como o exemplo abaixo:

<img src= ".\comando1.png" /> 

🟣 Validação de Links 

Comando 2 > **md-links ./caminhoDaPasta/nomeDoArquivo.md _--validate_** 

Esse comando fará uma requisição HTTP para verificar se cada link funciona ou não, apresentando uma tabela com o código de resposta (status HTTP) e uma mensagem correspondente em caso de sucesso (ok) ou falha (fail). Veja exemplo abaixo:

<img src= ".\comando2.png" /> 

🟣 Estatísticas de links 

Comando 3 > **md-links ./caminhoDaPasta/nomeDoArquivo.md _--stats_** 

Esse comando _--stats_, exibirá em uma tabela o número total de links encontrados no arquivo e o total de links únicos.

<img src= ".\comando4.png" />

🟣 Validação + Estatísticas de links 

Comando 4 > **md-links ./caminhoDaPasta/nomeDoArquivo.md _--stats --validate_**

Esses dois comandos juntos  _--validate --stats_ exibirá em uma tabela o número total de links encontrados no arquivo, o total de links únicos, e o número total de links quebrados. 

<img src= ".\comando3.png" /> 

## 5. Tecnologias utilizadas
 <img alt="JS" height="50" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-javascript-software-develop-command-language-256.png"> <img alt="git" height="40" src="https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-256.png"/> <img alt="github" height="45" src="https://cdn1.iconfinder.com/data/icons/unicons-line-vol-3/24/github-256.png"/> <img alt="nodejs" height="45" src="https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png"/> 