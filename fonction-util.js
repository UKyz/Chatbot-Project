const fs = require('fs-extra');
const R = require('ramda');
const {remove: removeDiacritics} = require('diacritics');
const levenshtein = require('fast-levenshtein');
const distance = require('jaro-winkler');
const papa = require('papaparse');

const deleteIgnoredChar = R.pipe(
  R.replace(/'/g, ' '),
  R.replace(/[^A-Za-z0-9 ]/g, ''),
  R.toLower()
);

const getFileContentAsString = R.pipeP(
  fs.readFile,
  R.toString
);

const parseFile = R.pipeP(
  getFileContentAsString,
  R.split('\n')
);

const papaparser = R.curry(x => papa.parse(x, {delimiter: ';', header: true}));

const parseCSV = R.pipeP(
  getFileContentAsString,
  papaparser,
  R.prop('data'),
  R.map(R.prop('Log')),
);
const cleanPhrases = R.pipe(
  removeDiacritics,
  deleteIgnoredChar,
);

const listAllWords = R.pipeP(
  parseFile,
  R.map(cleanPhrases),
  R.map(R.split(' ')),
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

const similarity = (p1, p2) => levenshtein.get(p1, p2);

const similarity2 = (p1, p2) => Math.round(distance(p1, p2) * 1000) / 10;

const getLength = (p1, p2) => {
  const lp1 = R.length(p1);
  const lp2 = R.length(p2);
  return R.gte(lp1, lp2) ? lp1 : lp2;
};

const getPercentage = (p1, p2) => Math.round((1 - (similarity(p1, p2) /
  getLength(p1, p2))) * 1000) / 10;

module.exports = {
  deleteIgnoredChar,
  parseFile,
  parseCSV,
  listAllWords,
  getNumberOfWords,
  countRecurrences,
  cleanPhrases,
  getPercentage,
  similarity,
  similarity2
};
