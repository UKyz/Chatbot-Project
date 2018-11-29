const R = require('ramda');
const {
  cleanPhrases,
  mapP,
  mapC,
  filterMethod,
  delDouble,
  similarity
} = require('./lib/fonction-util');

const testAlmostSame = elm => {
  return (
    (similarity(elm[0], elm[1]) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 1),
      elm[1].substring(0, elm[1].length - 1)) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 1), elm[1]) === 0) ||
    (similarity(elm[1].substring(0, elm[1].length - 1), elm[0]) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 2),
      elm[1].substring(0, elm[1].length - 2)) === 0) ||
    (similarity(elm[0].substring(0, elm[0].length - 2), elm[1]) === 0) ||
    (similarity(elm[1].substring(0, elm[1].length - 2), elm[0]) === 0)
  );
};

const clusterWordsBySimilarity_ = (sentences, brink) => R.pipe(
  // R.tap(console.log),
  R.map(R.split(' ')),
  R.flatten,
  R.countBy(R.toLower),
  R.toPairs,
  mapP,
  mapC,
  R.unnest,
  R.filter(filterMethod(R.__, brink)),
  delDouble,
  R.sort(R.descend(R.prop(2))),
  R.map(R.dropLast(1)),
  R.filter(testAlmostSame),
)(sentences);

const clusterSentences = (wordList, sentenceList) => {
  const listReturn = [];
  sentenceList.forEach(sentence1 => {
    const cutS1 = sentence1.split(' ');
    sentenceList.forEach(sentence2 => {
      const cutS2 = sentence2.split(' ');
      if (sentence1 !== sentence2) {
        listReturn.push({
          sentence1, sentence2,
          score: turnToPercent(testSentences(wordList, cutS1, cutS2),
            ((cutS1.length >= cutS2.length) ? cutS1.length : cutS2.length))
        });
      }
    });
  });
  return listReturn;
};

const testSentences = (wordList, words1, words2) => {
  let nbPoints = 0;
  words1.forEach(word1 => {
    words2.forEach(word2 => {
      if (word1 === word2 && word1.length >= 4) {
        nbPoints++;
      } else {
        wordList.forEach(double => {
          if ((word1 === double[0] && word2 === double[1]) ||
            (word1 === double[1] && word2 === double[0])) {
            nbPoints++;
          }
        });
      }
    });
  });
  return nbPoints;
};

const turnToPercent = (nbPoints, length) => {
  return Math.round((nbPoints / length) * 1000) / 10;
};

const cleanSentences_ = R.pipe(
  R.filter(R.complement(R.isNil)),
  R.map(cleanPhrases)
);

const regroupePhrase = async (sentences, brink) => {
  // Console.log(`sentences : ${sentences}`);
  const sameWords = await
  clusterWordsBySimilarity_(sentences, brink);

  // Console.log(sameWords);

  const listSplit = await cleanSentences_(sentences);

  return clusterSentences(sameWords, listSplit)
    .sort((a, b) => {
      return b.score - a.score;
    }).filter(list => {
      return list.score >= 0;
    });
};

/* -- const saveAsCSV = res => {
  const endTest = new Save('/Users/Victor/Documents/ESME Sudria/B5/test/',
    'Test', ['Phrase1', 'Phrase2', '% ressemblance']);
  endTest.data = res;
  endTest.saveAsCsv();
}; */

/* -- const main2 = async () => {
  console.log(await regroupePhrase('input/fichiers-texte/phrases_autre.txt',
  50));
};

main2(); */

module.exports = {regroupePhrase};
