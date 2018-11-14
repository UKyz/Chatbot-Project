const {clusterWordsBySimilarity_} = require('./lib/fonction-util');

/* Const testons = (p1, p2) => {return (p1[0] !== p2[2] || p1[2] !== p2[0])};
const fi = (p1, p2) => R.over(testons(p1, p2), p1);
const cal = R.curry((list, p) => R.map(x => fi(x, p), list));
const mapD = list => R.map(cal(list), list); */

clusterWordsBySimilarity_('input/fichiers-texte/phrase_aleatoire.txt', 85);
