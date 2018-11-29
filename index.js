const R = require('ramda');

const rp = require('request-promise');
const {parseCsvFile} = require('./lib/fonction-util');
const {regroupePhrase} = require('./regroupe-phrases');

const filterMethod = R.curry((list, brink) =>
  (list.score >= brink));

const filterTabTest = (phrases, brink) => R.pipe(
  R.filter(filterMethod(R.__, brink)),
  R.map(R.dissoc('score'))
)(phrases);

const clusterFunction = (phrases, tabTest) => {
  return rp({
    method: 'POST', uri: 'http://localhost:3010/cluster-sentence',
    body: {phrases, tabTest}, json: true
  });
};

const randomArray = (length, max) => [...new Array(length)]
  .map(() => Math.round(Math.random() * max));

const filterNumber = (sentences, arrayFilter) => {
  arrayFilter.sort((a, b) => {
    return (a - b);
  });
  const tab = [];
  arrayFilter.forEach(number => {
    tab.push(sentences[number]);
  });
  return tab;
};

const testClusterSentences = async (pathes, perSameWord, perSamePhrase) => {
  let tabFR = await parseCsvFile(pathes[0], ',', 'x');
  const arrayFR = randomArray(50, tabFR.length);
  tabFR = filterNumber(tabFR, arrayFR);
  let tabEN = await parseCsvFile(pathes[1], ',', 'x');
  const arrayEN = randomArray(50, tabEN.length);
  tabEN = filterNumber(tabEN, arrayEN);

  // -- const tabClExpected = [tabFR, tabEN];
  const tabMix = tabFR.concat(tabEN);

  const tabTest = await filterTabTest(await regroupePhrase(tabMix, perSameWord),
    perSamePhrase);

  console.log(await clusterFunction(tabMix, tabTest));
};

testClusterSentences(
  ['input/fichiers-csv/CorpusRandomTwitter/randomtweets1.csv',
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets3.csv'],
  50, 10);
