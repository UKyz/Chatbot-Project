const R = require('ramda');

const rp = require('request-promise');
const {parseTextFile, parseFile, listAllWordsInSentences} = require(
  './lib/fonction-util');
const {regroupePhrase} = require('./regroupe-phrases');
const {getIndicator} = require('./lib/indicator');

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

const testClusterSentences = async (path, perSameWord, perSamePhrase) => {
  const phrases = await parseTextFile(path);
  const tabTest = await filterTabTest(await regroupePhrase(path, perSameWord),
    perSamePhrase);
  console.log(await clusterFunction(phrases, tabTest));
};

testClusterSentences(inputPath, 50, 50);

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
