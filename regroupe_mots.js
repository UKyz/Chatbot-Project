const R = require('ramda');

const {parseFile, cleanPhrases, getPercentage} = require('./fonction-util');

const path = 'fichiers-texte/phrase_aleatoire.txt';

const brinkPer = 85;
const filtrer = list => (list[4] >= brinkPer && list[4] < 100);

const computeWeight = (p, listLength) => [
  p[0],
  p[1],
  Math.round((1 - p[1] / listLength) * 100) / 100
];
const calcWeight = R.curry((list, p) => computeWeight(p, list.length));
const mapP = list => R.map(calcWeight(list), list);

const compare = (p1, p2) => [
  p2[0],
  p2[1],
  p1[0],
  p1[1],
  getPercentage(p1[0], p2[0]),
];
const calcDistance = R.curry((list, p) => R.map(x =>
  compare(x, p), list));
const mapC = list => R.map(calcDistance(list), list);

const del_double = list => {
  list.forEach(elm => {
    list.forEach(elm2 => {
      if (elm[0] === elm2[2] && elm[2] === elm2[0]) {
        list.splice(list.indexOf(elm2), 1);
      }
    })
  });
  return list;
};

/*const testons = (p1, p2) => {return (p1[0] !== p2[2] || p1[2] !== p2[0])};
const fi = (p1, p2) => R.over(testons(p1, p2), p1);
const cal = R.curry((list, p) => R.map(x => fi(x, p), list));
const mapD = list => R.map(cal(list), list);*/


const getIndicator_ = R.pipe(
  R.map(cleanPhrases),
  R.map(R.split(' ')),
  R.flatten,
  R.countBy(R.toLower),
  R.toPairs,
  mapP,
  //R.tap(console.log),
  mapC,
  R.unnest,
  R.filter(filtrer),
  del_double,
  R.sort(R.descend(R.prop(4))),
  R.tap(console.log)
);

const test_ = async path => {
  getIndicator_(await parseFile(path));
};

test_(path);
