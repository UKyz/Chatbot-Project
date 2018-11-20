const fs = require('fs-extra');
const R = require('ramda');
const {remove: removeDiacritics} = require('diacritics');
const levenshtein = require('fast-levenshtein');
const distance = require('jaro-winkler');
const papa = require('papaparse');

const deleteIgnoredChar = R.pipe(
  R.replace(/'/g, ' '),
  R.replace(/-/g, ' '),
  R.replace(/[^A-Za-z0-9 ]/g, ''),
  R.toLower()
);

const cleanPhrases = R.pipe(
  removeDiacritics,
  deleteIgnoredChar,
);

const getFileContentAsString = R.pipeP(
  fs.readFile,
  R.toString
);
/**
 * Allows to parse a file of type *.txt
 * @param {String} data The relative or absolute path to the file
 * @returns {Array<String>} A sentence table
 */
const parseTextFile = R.pipeP(
  getFileContentAsString,
  R.split('\n'),
  R.map(cleanPhrases)
);

const papaparser = R.curry(
  (delimiter, data) => papa.parse(data, {delimiter, header: true}));
/**
 * Allows to parse a file of type *. csv
 * @param {String} data The relative or absolute path to the file
 * @param {String} delimiter The delimiter that separates the data from the
 *   same line
 * @param {String} column The column from which we want to retrieve the data
 * @returns {Array<String>} A sentence table
 */
const parseCsvFile = (data, delimiter = ';', column = 'Log') => R.pipeP(
  getFileContentAsString,
  papaparser(delimiter),
  R.prop('data'),
  R.map(R.prop(column)),
)(data);
/**
 * Allows to parse a file of type *. csv or *.txt
 * @param {String} path The relative or absolute path to the file
 * @returns {Array<String>} A sentence table
 */
const parseFile = path => {
  return R.equals(R.slice(R.lastIndexOf('.', path), path), '.txt') ?
    parseTextFile(path) :
    parseCsvFile(path);
};

const listAllWords = R.pipeP(
  parseFile,
  R.map(cleanPhrases),
  R.map(R.split(' ')),
  R.flatten
);

/**
 * List all word in sentences
 * @param {String} sentence The sentences who want to list
 * @returns {Array} A array with all words in the sentences
 */
const listAllWordsInSentences = R.pipe(
  cleanPhrases,
  R.split(' '),
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

/* Regroupe-mots */

const filterMethod = R.curry((list, brink) =>
  (list[2] >= brink && list[2] < 100));

const computeWeight = (p, listLength) => [
  p[0],
  p[1],
  Math.round((1 - (p[1] / listLength)) * 100) / 100
];
const calcWeight = R.curry((list, p) => computeWeight(p, list.length));
const mapP = list => R.map(calcWeight(list), list);

const compare = (p1, p2) => [
  p2[0],
  p1[0],
  getPercentage(p1[0], p2[0])
];
const calcDistance = R.curry((list, p) => R.map(x =>
  compare(x, p), list));
const mapC = list => R.map(calcDistance(list), list);

const delDouble = list => {
  list.forEach(elm => {
    list.forEach(elm2 => {
      if (elm[0] === elm2[1] && elm[1] === elm2[0]) {
        list.splice(list.indexOf(elm2), 1);
      }
    });
  });
  return list;
};

const clusterWordsBySimilarity_ = (path, brink) => R.pipeP(
  parseFile,
  R.map(cleanPhrases),
  R.map(R.split(' ')),
  R.flatten,
  R.countBy(R.toLower),
  R.toPairs,
  mapP,
  R.tap(console.log),
  mapC,
  R.unnest,
  R.filter(filterMethod(R.__, brink)),
  delDouble,
  R.sort(R.descend(R.prop(2))),
  R.tap(console.log)
)(path);

/* ! Regroupe-mots */

module.exports = {
  deleteIgnoredChar,
  parseFile,
  parseTextFile,
  parseCsvFile,
  listAllWords,
  listAllWordsInSentences,
  getNumberOfWords,
  countRecurrences,
  cleanPhrases,
  getPercentage,
  similarity,
  similarity2,
  clusterWordsBySimilarity_,
  mapP,
  mapC,
  filterMethod,
  delDouble
};
