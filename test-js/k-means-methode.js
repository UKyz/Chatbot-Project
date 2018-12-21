const R = require('ramda');
const fs = require('fs-extra');

const {getCsvData} = require('../lib/confusion-matrix-csv');
const {parseCsvFile, listAllWordsInSentences} = require(
  '../lib/fonction-util');
const {plotDataClustered: plot} = require('../lib/plot');
const {kmeans} = require('../sls/k-means/k-means');

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

const process = async () => {
  const sentencesFR1 = await parseCsvFile(
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets1.csv',
    ',', 'x');
  console.log('parsing: 1/4');
  const sentencesFR2 = await parseCsvFile(
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets2.csv',
    ',', 'x');
  console.log('parsing: 2/4');
  const sentencesEN1 = await parseCsvFile(
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets3.csv',
    ',', 'x');
  console.log('parsing: 3/4');
  const sentencesEN2 = await parseCsvFile(
    'input/fichiers-csv/CorpusRandomTwitter/randomtweets4.csv',
    ',', 'x');
  console.log('parsing: 4/4');
  const sentencesFR = R.concat(sentencesFR1, sentencesFR2);
  const sentencesEN = R.concat(sentencesEN1, sentencesEN2);
  const sentences = R.concat(sentencesFR, sentencesEN);
  console.log('sentence ready');
  const indicator = await fs.readJson('./indicatorENFR.json');
  // Const indicator = getIndicator(sentences);
  // fs.writeJson('./indicatorENFR.json', indicator);
  console.log('indicator ready');
  const dataSet = getDataObj_(sentences, indicator);
  console.log('data object ready');
  const eqTab = {sentence: 'text', length: 'x', indicator: 'y'};
  const res = kmeans(dataSet, eqTab, 10);
  fs.writeJson('./res.json', res);
  const resToConfusionMatrix = R.map(R.map(R.prop('sentence')), res);
  console.log('data clustered ready');
  const buffer = getCsvData([sentencesFR, sentencesEN],
    ['Set FR', 'Set EN'],
    resToConfusionMatrix);
  fs.writeFileSync('k_means.csv', buffer);
  plot(res, eqTab);
};

process();
