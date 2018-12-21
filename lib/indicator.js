const R = require('ramda');
const levenshtein = require('fast-levenshtein');

const {countRecurrences} = require('./fonction-util');

const correctOccurrences_ = (value, key, obj) => {
  R.keys(obj).forEach(elem => {
    const similitude = 1 - (levenshtein.get(key, elem) /
      Math.max(key.length, elem.length));
    if (key < elem && similitude > 0.8) {
      const sum = value + obj[elem];
      obj[elem] = sum;
      obj[key] = sum;
    }
  });
};

const getMax = map => R.pipe(
  R.values,
  R.reduce(R.max, 0)
)(map);

/* Const computeWeight_ = map => {
  const max = Math.max(...R.values(map));
  R.forEachObjIndexed(correctOccurrences_, map);
  R.keys(map).forEach(elem => {
    map[elem] /= max;
  });
  return map;
}; */

const computeWeight_ = map => R.pipe(
  R.map(R.divide(R.__, getMax(map)))
)(map);

const getIndicator = R.pipe(
  countRecurrences,
  R.forEachObjIndexed(correctOccurrences_),
  computeWeight_,
);

module.exports = {getIndicator};
