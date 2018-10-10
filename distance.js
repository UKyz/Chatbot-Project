const levenshtein = require('fast-levenshtein');
const {remove: removeDiacritics} = require('diacritics');
const R = require('ramda');

const {cleanPhrases, parseFile, getPercentage, similarity} = require('./fonction-util');

const path = 'fichiers-texte/ptitTexte.txt';

const listPhrases = [
  'Je voudrais un ticket pour Lille',
  'J\'aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam',
  'Je voudrais connaître mes horaires de vol',
  'À quelle heure est le prochain avion pour Paris',
  'Combien d\'heure dure ce trajet'
];

const computePercentage = (p1, p2, list) => [
  R.indexOf(p1, list),
  similarity(p1, p2),
  getPercentage(p1, p2)
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
