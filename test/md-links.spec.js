/* const assert = require('assert');
const { statsFunction, validateFunction } = require('./cli.js');

// Exemplo de teste para a função statsFunction
const testStatsFunction = () => {
  const arrayLinks = [
    { href: 'https://example.com', ok: true },
    { href: 'https://google.com', ok: false },
    { href: 'https://github.com', ok: true },
  ];

  const expectedStats = {
    total: 3,
    unique: 3,
    broken: 1,
  };

  const result = statsFunction(arrayLinks);
  assert.deepStrictEqual(result, expectedStats, 'statsFunction não retornou o resultado esperado.');
};

// Exemplo de teste para a função validateFunction
const testValidateFunction = () => {
  const arrayLinks = [
    { href: 'https://example.com', text: 'Link 1', file: 'exemplo.md' },
    { href: 'https://google.com', text: 'Link 2', file: 'exemplo.md' },
  ];

  const expectedLinks = [
    { href: 'https://example.com', text: 'Link 1', file: 'exemplo.md', status: 200, ok: true },
    { href: 'https://google.com', text: 'Link 2', file: 'exemplo.md', status: 'NÃO_ENCONTRADO', ok: false },
  ];

  const result = validateFunction(arrayLinks);
  assert.deepStrictEqual(result, expectedLinks,
    'validateFunction não retornou o resultado esperado.');
};

// Exemplo de teste para a função mdLinks
const testMdLinks = () => {
  // Escreva seus cenários de teste aqui
};

// Executar os testes
testStatsFunction();
testValidateFunction();
testMdLinks();

console.log('Todos os testes foram executados com sucesso!'); */
