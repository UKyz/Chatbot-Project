const fs = require('fs-extra');
const R = require('ramda');
const {remove: removeDiacritics} = require('diacritics');

const deleteIgnoredChar = R.pipe(
  R.replace(/'/g, ' '),
  R.replace(/[^A-Za-z0-9 ]/g, ''),
  R.toLower()
);

const parseFile = R.pipeP(
  fs.readFile,
  R.toString,
  R.split('\n'),
);

const cleanPhrases = R.pipe(
  removeDiacritics,
  deleteIgnoredChar,
  R.split(' ')
);

const listAllWords = R.pipeP(
  parseFile,
  R.map(cleanPhrases),
  R.flatten
);

// Thanks Alexia for this methode
const getNumberOfWords = R.pipeP(
  listAllWords,
  R.length
);

const countRecurrences = R.pipeP(
  listAllWords,
  R.countBy(R.toLower)
);

module.exports = {
  deleteIgnoredChar,
  parseFile,
  listAllWords,
  getNumberOfWords,
  countRecurrences
};
