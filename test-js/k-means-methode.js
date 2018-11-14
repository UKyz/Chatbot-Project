const R = require('ramda');
const kMeans = require('node-kmeans');

const {getIndicator} = require('../lib/indicator');
const {parseFile, listAllWordsInSentences} = require('../lib/fonction-util');
const {plotDataClustered: plot} = require('../lib/plot');

const pathFileIn = '../input/fichiers-texte/phrase_aleatoire.txt';

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

const getVector = R.map(R.pipe(
  R.values,
  R.drop(1)
));

const process = async path => {
  const sentences = await parseFile(path);
  const indicator = await getIndicator(pathFileIn);
  const dataSet = getDataObj_(sentences, indicator);
  kMeans.clusterize(getVector(dataSet), {k: 7}, (err, res) => {
    const dataClustered = [];
    if (err) {
      console.error(err);
    } else {
      const clusterList = R.map(R.prop('clusterInd'), res);
      clusterList.forEach(cluster => {
        const tab = [];
        cluster.forEach(index => {
          tab.push(dataSet[index]);
        });
        dataClustered.push(tab);
      });
    }
    console.log(dataClustered);
    plot(dataClustered, {sentence: 'text', length: 'x', indicator: 'y'});
  });
};

process(pathFileIn);
