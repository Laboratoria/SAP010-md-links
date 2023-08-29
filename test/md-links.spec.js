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
