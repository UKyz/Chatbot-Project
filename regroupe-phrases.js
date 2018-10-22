const R = require('ramda');
const {
  parseFile,
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

const clusterWordsBySimilarity_ = (path, brink) => R.pipeP(
  parseFile,
  R.map(cleanPhrases),
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
)(path);

const cleanSentences_ = R.pipeP(
  parseFile,
  R.map(cleanPhrases)
);

const clusterSentences = (wordList, sentenceList) => {
  const listReturn = [];
  sentenceList.forEach(sentence1 => {
    const cutS1 = sentence1.split(' ').length;
    sentenceList.forEach(sentence2 => {
      const cutS2 = sentence2.split(' ').length;
      if (sentence1 !== sentence2) {
        listReturn.push([sentence1, sentence2, turnToPercent(
          testSentences(wordList, cutS1, cutS2),
          ((cutS1.length >= cutS2.length) ? cutS1.length : cutS2.length))]);
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

const main = async (path, brink) => {
  const sameWords = await
  clusterWordsBySimilarity_(path, brink);

  const listSplit = await
  cleanSentences_(path);

  const sentencesClustered =
    clusterSentences(sameWords, listSplit).sort((a, b) => {
      return b[2] - a[2];
    }).filter(list => {
      return list[2] >= 0;
    });

  console.log(sentencesClustered);
};

main('fichiers-texte/phrase_aleatoire.txt', 85);
