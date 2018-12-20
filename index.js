const R = require('ramda');
const rp = require('request-promise');

const {parseCsvFile, parseFile, listAllWordsInSentences} = require(
  './lib/fonction-util');
const {regroupePhrase} = require('./regroupe-phrases');
const {getIndicator} = require('./lib/indicator');
const {getCsvData} = require('./lib/confusion-matrix-csv');
// -- const fs = require('fs-extra');
const inputPath = 'input/fichiers-texte/phrases_autre.txt';

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

const testClusterSentences = async (pathes, perSameWord, perSamePhrase,
  nbSentences) => {
  let tabFR = await parseCsvFile(pathes[0], ',', 'x');
  const arrayFR = randomArray(nbSentences, tabFR.length);
  tabFR = filterNumber(tabFR, arrayFR);
  let tabEN = await parseCsvFile(pathes[1], ',', 'x');
  const arrayEN = randomArray(nbSentences, tabEN.length);
  tabEN = filterNumber(tabEN, arrayEN);

  const tabClExpected = [tabFR, tabEN];
  const tabMix = tabFR.concat(tabEN);

  const tabTest = await filterTabTest(await regroupePhrase(tabMix,
    perSameWord), perSamePhrase);

  const output = await clusterFunction(tabMix, tabTest);

  console.log(output);

  await getCsvData(tabClExpected, ['Set FR', 'Set EN'],
    output);

  /* -- fs.writeFileSync('/Users/Victor/Documents/ESME' +
   ' Sudria/B5/test/testWallah2.csv',
    await getCsvData(tabClExpected, ['Set FR', 'Set EN'],
    await clusterFunction(tabMix, tabTest))); */
};

testClusterSentences(
  ['input/fichiers-csv/CorpusRandomTwitter/randomtweets1.csv',
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets3.csv'],
  50, 40, 100);

const getIndicatorSentence = (sentence, indicator) => R.pipe(
  listAllWordsInSentences,
  R.map(word => indicator[word]),
  R.mean,
)(sentence);

const essai1_ = R.curry((indicator, sentence) => ({
  sentence,
  length: R.length(R.split(' ', sentence)),
  indicator: getIndicatorSentence(sentence, indicator)
}));

const getDataObj_ = (sentences, indicator) => R.map(essai1_(indicator),
  sentences);

const kMeansCluster = (dataSet, eqTab, nbCluster) => {
  return rp({
    method: 'POST', uri: 'http://localhost:3020/kmeans',
    body: {dataSet, eqTab, nbCluster}, json: true
  });
};
const testKMeansMethode = async () => {
  const sentences = await parseFile(inputPath);
  const indicator = await getIndicator(inputPath);
  const dataSet = getDataObj_(sentences, indicator);
  kMeansCluster(dataSet, {}, 4);
  console.log(dataSet);
};
testKMeansMethode();

