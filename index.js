const rp = require('request-promise');
const {parseTextFile} = require('./lib/fonction-util');

const inputPath = 'input/fichiers-texte/phrases_autre.txt';

const rand = (data, nbOfCluster) => {
  rp({
    method: 'POST', uri: 'http://localhost:3010/rand',
    body: {data, nbOfCluster}, json: true
  }).then(res => console.log(res));
};

const main = async () => {
  const data = await parseTextFile(inputPath);
  console.log(data);
  rand(data, 7);
};

main();
