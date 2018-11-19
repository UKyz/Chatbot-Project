const R = require('ramda');

const {wordWeight_} = require('./group-weight');
const {parseFile} = require('./lib/fonction-util');

const mean_ = R.memoizeWith(R.identity, R.pipe(
  wordWeight_,
  R.map(R.prop(2)),
  R.values,
  R.mean,
));

const deviation_ = R.memoizeWith(R.identity, x => {
  const tab = wordWeight_(x);
  let deviation = 0;
  tab.forEach(element => {
    deviation += (element[2] - mean_(x)) ** 2;
  });
  return (deviation / tab.length) ** 0.5;
});

const normality68 = x => [mean_(x) - deviation_(x), mean_(x) + deviation_(x)];

const parse_ = async path => {
  console.log(normality68(await parseFile(path)));
};

parse_('air-france-inspiration-2018-09-28-logs.csv');
