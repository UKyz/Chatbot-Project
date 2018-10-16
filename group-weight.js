const R = require('ramda');

const {nbMotsIdentiques_} = require('./wordpercent');

const sentences = ['Je voudrais un truc ticket truc pour Lille',
  'J aimerais un truc billet pour truc Toulouse',
  'Un vol truc pour Amsterdam'];

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

const groupByWordWeight_ = (weight, list) => {
  const tab = wordWeight_(list);
  const group = [];

  tab.forEach(elm => {
    if (elm[2] > weight) {
      group.push(elm[0], elm[2]);
    }
  });
  return group;
};

const clusterWeight_ = R.pipe(
  R.tap(console.log),
  R.splitEvery(2),
  R.tap(console.log),
);

wordWeight_(sentences);
clusterWeight_(groupByWordWeight_(0.5, sentences));
