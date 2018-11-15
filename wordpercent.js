const R = require('ramda');

const {cleanPhrases, getPercentage, parseFile} = require('./lib/fonction-util');

const phrases = ['Je voudrais un truc ticket truc pour Lille',
  'J aimerais un truc billet pour truc Toulouse',
  'Un vol truc pour Amsterdam'];

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
);

const parse_ = async path => {
  ressemblance_(await parseFile(path))
};

//nbMots_(phrases);
//nbMotsIdentiques_(phrases);
//nbLettresParMot_(phrases);
parse_('air-france-inspiration-2018-09-28-logs.csv');

module.exports = {nbMotsIdentiques_, modifiedData_, phrases, nbMots_};
