const R = require('ramda');

const {cleanPhrases, getPercentage} = require('./fonction-util');

const phrases = ['Je voudrais un ticket pour Lille',
  'J aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam'];

const modifiedData_ = R.pipe(
  R.map(cleanPhrases),
  R.map(R.split(' ')),
  R.flatten,
);

const nbMots_ = R.pipe(
  modifiedData_,
  R.length,
);

const nbMotsIdentiques_ = R.pipe(
  modifiedData_,
  R.countBy(R.toLower),
);

const nbLettresParMot_ = R.pipe(
  modifiedData_,
  R.map(R.pipe(R.splitEvery(1), R.length))
);

const calcPourcentage = (p1, p2, list) => [
  R.indexOf(p1, list),
  getPercentage(p1, p2)
];

const calcDistance = R.curry((list, p) => R.map(x =>
  calcPourcentage(x, p, list), list));
const mapDistance = list => R.map(calcDistance(list), list);

const ressemblance_ = R.pipe(
  modifiedData_,
  mapDistance,
  R.tap(console.log),
);

console.log(nbMots_(phrases));
console.log(nbMotsIdentiques_(phrases));
console.log(nbLettresParMot_(phrases));
ressemblance_(phrases);
