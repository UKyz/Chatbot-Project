const R = require('ramda');

const {nbMotsIdentiques_} = require('./wordpercent');

const sentences = ['Je voudrais un ticket pour Lille',
  'J aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam'];

const maxWeight_ = R.pipe(
  R.reduce(R.maxBy(R.prop(1)), ['', -Infinity]),
  R.prop(1)
);

const computeWeight = (p, list) => [
  p[0],
  p[1],
  Math.round((p[1] / maxWeight_(list)) * 100) * 0.01
];
const calcWeight = R.curry((list, p) => computeWeight(p, list));
const mapP = list => R.map(calcWeight(list), list);

const wordWeight_ = R.pipe(
  nbMotsIdentiques_,
  R.toPairs,
  mapP,
);

// console.log(sentences);
console.log(wordWeight_(sentences));
