const R = require('ramda');

const {
  parseTextFile
} = require('./lib/fonction-util');

const {
  main
} = require('./regroupe-phrases');

const filterMethod = R.curry((list, brink) =>
  (list.score >= brink));

const filterTabTest = (phrases, brink) => R.pipe(
  R.filter(filterMethod(R.__, brink)),
  R.map(R.dissoc('score'))
)(phrases);

const main2 = async (path, perSameWord, perSamePhrase) => {
  const phrases = await parseTextFile(path);
  const tabTest = await filterTabTest(await main(path, perSameWord),
    perSamePhrase);
  console.log(tabTest);
  const cluster = [];
  cluster.push([[phrases[0]]]);
  phrases.forEach(p => {
    if (phrases.indexOf(p) !== 0) {
      let test = false;
      cluster.forEach(cl => {
        cl.forEach(sousCl => {
          sousCl.forEach(pCl => {
            if (tabTest.find(obj => obj.sentence1 === p &&
              obj.sentence2 === pCl) !== undefined &&
              test === false) {
              sousCl.push(p);
              test = true;
            }
          });
        });
      });
      if (test === false) {
        cluster.push([[p]]);
        test = true;
      }
    }
  });
  console.log(cluster);
};

main2('input/fichiers-texte/phrases_autre.txt', 50, 50);
