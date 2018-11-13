const R = require('ramda');

const {cleanPhrases,
  parseFile,
  getPercentage,
  similarity2
} = require('./lib/fonction-util');

const path = 'input/fichiers-texte/phrases_autre.txt';

const computePercentage = (p1, p2, list) => [
  R.indexOf(p1, list),
  getPercentage(p1, p2),
  similarity2(p1, p2)
];

const calcDistance = R.curry((list, p) => R.map(x =>
  computePercentage(x, p, list), list));

const mapDistance = list => R.map(calcDistance(list), list);

const sortByDistance = R.sortBy(R.prop(2));

const test_ = R.pipe(
  R.map(cleanPhrases),
  mapDistance,
  R.map(sortByDistance),
  R.tap(console.log)
);

const parse_ = async path => {
  console.log(test_(await parseFile(path)));
};

parse_(path);
