# Markdown Links

## Índice

* [1. Prefácio](#1-prefácio)
* [2. Guia de Instalação e Uso](#2-guia-de-instalação-e-uso)
* [3. Fluxograma](#3-fluxograma)
* [4. Tecnologias Utilizadas](#4-tecnologias-utilizadas)

***

## 1. Prefácio 

[Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em diversas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
`README.md`).

O Objetivo deste projeto foi desenvolver uma biblioteca que lê arquivos Markdown através de uma CLI (command-line interface) que possiblita a execução da biblioteca no terminal, a partir de um módulo do Node.js, no qual, este irá fazer a leitura dos arquivos em formato Markdown('.md'), verificando a existência de links e estatísticas que nele existem.

## 2. Guia de Instalação e Uso

Instale a biblioteca no terminal através do comando: <strong>`npm install jessicazanon-mdlinks`</strong>

Após a instalação, certifique de ter um arquivo <strong>.md com links</strong> dentro.

<br>
1. Rode o comando <strong>`mdlinks` + o caminho do seu arquivo </strong> e será retornado o text, o link e o arquivo. Veja o exemplo abaixo:  
![mdLinks](./src/imagensMd/caminho%20do%20arquivo.png)

2. Se você deseja validar os links desses arquivos, utilize a propriedade <strong>--validade</strong>, esta fará uma requisição HTTP e retornará o status e o ok do seu link. Indicando se o link é válido ou falho. <br>
Comando: `md-links <caminho-do-arquivo> --validate` <br>
 Veja o exemplo abaixo:<br>
 ![validate](./src/imagensMd/validate.png)

 3. Se você deseja verificar as estatísticas dos links desse arquivo, utilize a propriedade <strong>--stats</strong>, esta retornará o total de links encontrados no arquivo e quais desses são únicos. <br>
Comando: `md-links <caminho-do-arquivo> --stats` <br>
 Veja o exemplo abaixo:<br>
 ![stats](./src/imagensMd/stats.png)

 4. Se você deseja verificar as estatísticas e validar os links desse arquivo, utilize a propriedade <strong>--validade --stats</strong>, estas retornarão o total de links encontrados no arquivo, quais desses são únicos e quais estão quebrados. <br>
Comando: `md-links <caminho-do-arquivo> --validate --stats` <br>
 Veja o exemplo abaixo:<br>
 ![validateAndStats](./src/imagensMd/validate%20e%20stats.png)


## 3. Fluxograma 
Fluxograma do projeto <br>

![fluxograma](./src/imagensMd/Fluxograma%20MD%20Links%20Jess.jpg)


## 4. Tecnologias Utilizadas 🚀

 <img alt="JS" height="50" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-javascript-software-develop-command-language-256.png"> <img alt="git" height="40" src="https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-256.png"/> <img alt="github" height="45" src="https://cdn1.iconfinder.com/data/icons/unicons-line-vol-3/24/github-256.png"/> <img alt="nodejs" height="45" src="https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png"/> 