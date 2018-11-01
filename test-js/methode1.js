const R = require('ramda');

const {getIndicator} = require('../lib/indicator');
const {parseFile} = require('../lib/fonction-util');
const ResultSave = require('../lib/result-save');

const pathFileIn = '../csv-files/air-france-inspiration-2018-09-28-logs.csv';
const pathFileOut = '../res/';

/**
 * Formate a numeric value to a percentage
 * @param {number} value the numeric value
 * @returns {string} formated value
 * @private
 */
const percentage_ = value => `${(value * 100).toFixed(
  2)}%`;

const process = async () => {
  const sentences = await parseFile(pathFileIn);
  const indicator = await getIndicator(pathFileIn);
  const bestIndicator = getBestWords_(indicator);
  const data = countImportantWordsInSentences_(sentences, bestIndicator);
  const res = new ResultSave(pathFileOut, 'ReuMotsImportant',
    ['sentence', 'numberImportantWordsPerTotalWords']);
  res.data = data;
  res.sortBy('numberImportantWordsPerTotalWords');
  res.saveAsCsv();
};

const getSentencesAsObjectArray_ = R.pipe(
  R.aperture(1),
  R.map(R.concat(['sentence'], R.__)),
  R.aperture(1),
  R.map(R.fromPairs),
);

const countImportantWords_ = (sentence, bestIndicator) => R.pipe(
  R.split(' '),
  R.filter(R.contains(R.__, R.keys(bestIndicator))),
  R.length
)(sentence);

const countImportantWordsInSentences_ = (sentences, bestIndicator) => R.pipe(
  getSentencesAsObjectArray_,
  R.map(addCount_(R.__, bestIndicator)),
)(sentences);

const addCount_ = R.curry(
  (map, bestInd) => R.assoc('numberImportantWordsPerTotalWords',
    percentage_(countImportantWords_(map.sentence, bestInd) /
      R.split(' ', map.sentence).length), map));

const getTenPercent_ = list => R.pipe(
  R.length,
  R.multiply(R.__, 0.9),
  R.drop(R.__, list)
)(list);

const getBestWords_ = R.pipe(
  R.toPairs,
  R.sortBy(R.descend(R.prop(1))),
  getTenPercent_,
  R.fromPairs,
);

process();

