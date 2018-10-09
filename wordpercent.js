const R = require('ramda');
const removeDiacritics = require('diacritics').remove;
const levenshtein = require('fast-levenshtein');

const phrases = ['Je voudrais un ticket pour Lille',
  'J aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam'];

const modifieData_ = R.pipe(
  R.map(removeDiacritics),
  R.map(R.replace(/'/gi, ' ')),
  R.map(R.toLower),
  R.map(R.split(' ')),
  R.flatten,
);

const nbMots_ = R.pipe(
  modifieData_,
  R.length,
);

const nbMotsIdentiques_ = R.pipe(
  modifieData_,
  R.countBy(R.toLower),
);

const nbLettresParMot_ = R.pipe(
  modifieData_,
  R.map(R.splitEvery(1)),
  R.map(R.length),
);

const similarity = (p1, p2) => levenshtein.get(p1, p2);
const getLength = (p1, p2) => (p1.length >= p2.length) ? p1.length : p2.length;
const getPourcentage = (sim, len) => Math.round((1 - (sim / len)) * 1000) / 10;

const calcPourcentage = (p1, p2, list) => [
  R.indexOf(p1, list),
  getPourcentage(similarity(p1, p2), getLength(p1, p2))
];

const calcDistance = R.curry((list, p) => R.map(x =>
  calcPourcentage(x, p, list), list));
const mapDistance = list => R.map(calcDistance(list), list);

const ressemblance_ = R.pipe(
  modifieData_,
  mapDistance,
  R.tap(console.log),
);

console.log(nbMots_(phrases));
console.log(nbMotsIdentiques_(phrases));
console.log(nbLettresParMot_(phrases));
ressemblance_(phrases);
