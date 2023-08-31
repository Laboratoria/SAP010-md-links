const {  mdLinks } = require('../index.js');
const fs = require('fs').promises;
const axios = require('axios');

jest.mock('axios');
jest.mock('fs').promises;

const mdLinks = require('../src');


describe('mdLinks', () => {

  it('should...', () => {
    console.log('FIX ME!');
  });

});

describe('mdLinks', () => {
  it('deve resolver verificação de arquivo .md com 10 links', () => {
    return mdLinks('links-to-check.md').then((result) => {
      //expect...;
    });
  });
});
