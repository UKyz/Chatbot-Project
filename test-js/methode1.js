const R = require('ramda');

const {getIndicator} = require('../lib/indicator');
const {parseFile} = require('../lib/fonction-util');
const ResultSave = require('../lib/result-save');

const pathFileIn = '../fichiers-texte/phrases_autre.txt';
const pathFileOut = '../results/';

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
  let indicator = await getIndicator(pathFileIn);
  const bestIndicator = getBestWords_(indicator);
  const res = countImportantWordsInSentences_(sentences);
  //console.log(countImportantWords_(sentences[8], bestIndicator));
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

