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

const listAllWords = R.pipeP(
  R.compose(parseFile),
  R.map(removeDiacritics),
  R.map(deleteIgnoredChar),
  R.map(R.split(' ')),
  R.flatten,
);

// Thanks Alexia for this methode
const getNomberOfWords = R.pipeP(
  R.compose(listAllWords),
  R.length,
);

const countRecurrences = R.pipeP(
  R.compose(listAllWords),
  R.countBy(R.toLower),
);

module.exports = {
  deleteIgnoredChar,
  parseFile,
  listAllWords,
  getNomberOfWords,
  countRecurrences
};