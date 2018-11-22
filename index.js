const R = require('ramda');

const rp = require('request-promise');
const {parseTextFile} = require('./lib/fonction-util');
const {regroupePhrase} = require('./regroupe-phrases');

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
