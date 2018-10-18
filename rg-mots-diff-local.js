const R = require('ramda');
const {getPercentage, parseFile, cleanPhrases, similarity} = require('./lib/fonction-util');

const filterMethod = R.curry((list, brink) =>
  (list[4] >= brink && list[4] < 100));

const computeWeight = (p, listLength) => [
  p[0],
  p[1],
  Math.round((1 - (p[1] / listLength)) * 100) / 100
];
const calcWeight = R.curry((list, p) => computeWeight(p, list.length));
const mapP = list => R.map(calcWeight(list), list);

const compare = (p1, p2) => [
  p2[0],
  p2[1],
  p1[0],
  p1[1],
  getPercentage(p1[0], p2[0])
];
const calcDistance = R.curry((list, p) => R.map(x =>
  compare(x, p), list));
const mapC = list => R.map(calcDistance(list), list);

const testAlmostSame = (elm) => {
  return (
    (similarity(elm[0], elm[2]) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 1),
      elm[2].substring(0, elm[2].length - 1)) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 1), elm[2]) === 0) ||
    (similarity(elm[2].substring(0, elm[2].length - 1), elm[0]) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 2),
      elm[2].substring(0, elm[2].length - 2)) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 2), elm[2]) === 0) ||
    (similarity(elm[2].substring(0, elm[2].length - 2), elm[0]) === 0)
  );
};

const delDouble = list => {
  list.forEach(elm => {
    list.forEach(elm2 => {
      if (elm[0] === elm2[2] && elm[2] === elm2[0]) {
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
  mapC,
  R.unnest,
  R.filter(filterMethod(R.__, brink)),
  delDouble,
  R.sort(R.descend(R.prop(4))),
  R.filter(testAlmostSame),
  R.tap(console.log)
)(path);

clusterWordsBySimilarity_('fichiers-texte/phrase_aleatoire.txt', 85);