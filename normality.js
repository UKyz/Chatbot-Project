const R = require('ramda');

const {phrases} = require('./wordpercent');
const {wordWeight_} = require('./group-weight');

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

console.log(normality68(phrases));
