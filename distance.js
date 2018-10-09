const levenshtein = require('fast-levenshtein');
const removeDiacritics = require('diacritics').remove;
const R = require('ramda');

const normalizeString_ = R.pipe(
  removeDiacritics(R),
  R.toLower(),
);

const listPhrases = [
  'Je voudrais un ticket pour Lille',
  'J\'aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam',
  'Je voudrais connaître mes horaires de vol',
  'À quelle heure est le prochain avion pour Paris',
  'Combien d\'heure dure ce trajet'
];

const similarity = (p1, p2) => levenshtein.get(p1, p2);
const getLength = (p1, p2) => (p1.length >= p2.length) ? p1.length : p2.length;
const getPourcentage = (sim, len) => Math.round((1 - (sim / len)) * 1000) / 10;

const calcPourcentage = (p1, p2, list) => [
  R.indexOf(p1, list),
  levenshtein.get(p1, p2),
  getPourcentage(similarity(p1, p2), getLength(p1, p2))
];

const calcDistance = R.curry((list, p) => R.map(x =>
  calcPourcentage(x, p, list), list));
const mapDistance = list => R.map(calcDistance(list), list);

const sortByDistance = R.sortBy(R.prop(2));

const test_ = R.pipe(
  R.map(normalizeString_),
  mapDistance,
  R.map(sortByDistance),
  R.tap(console.log),
);

test_(listPhrases);
