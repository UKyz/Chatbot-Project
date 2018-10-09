const R = require('ramda');
const levenshtein = require('fast-levenshtein');

const {countRecurrences, getNomberOfWords} = require('./fonction-util');

const path = 'fichiers-texte/textMotsSimilaires.txt';

const correctOccurence_ = (value, key, obj) => {
  R.keys(obj).forEach(elem => {
    const similitude = (1 - levenshtein.get(key, elem)) /
      Math.max(key.length, elem.length);
    if (key < elem && similitude > 0.8) {
      const sum = value + obj[elem];
      obj[elem] = sum;
      obj[key] = sum;
    }
  });
};

const getIndicator_ = R.pipe(
  R.forEachObjIndexed(correctOccurence_),
  // TODO: Faire le calcul de l'indicateur (1 - nombre_de_mots / nombre_de_mots_totals
);

const test_ = async path => {
  console.log(getIndicator_(await countRecurrences(path)));
};

test_(path);
