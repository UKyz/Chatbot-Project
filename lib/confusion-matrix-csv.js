const R = require('ramda');

const getGroupIndex = (data, sentence) => {
  let i = 0;
  while (data[i].findIndex(x => x === sentence) === -1) {
    i++;
  }
  return i;
};

/**
 *
 * @param {Array<Array<String>>} exceptedData Well classified groups of
 *   sentences
 * @param {Array<String>} inputLabel Labels for well-classified groups of
 *   sentences
 * @param {Array<Array<String>>} dataClustered Sentence groups classified
 *   according to a process
 * @returns {String} The raw data as a String intended to be written to a csv
 *   file
 * @example
 * exceptedData = [ [ 'sentence A0',
 * 'sentence A1',
 * 'sentence A2',
 * 'sentence A3',
 * 'sentence A4' ],
 * [ 'sentence B0',
 * 'sentence B1',
 * 'sentence B2',
 * 'sentence B3',
 * 'sentence B4' ],
 * [ 'sentence C0',
 * 'sentence C1',
 * 'sentence C2',
 * 'sentence C3',
 * 'sentence C4' ],
 * [ 'sentence D0',
 * 'sentence D1',
 * 'sentence D2',
 * 'sentence D3',
 * 'sentence D4' ] ];
 * inputLabel = [ 'Data set A', 'Data set B', 'Data set C', 'Data set D' ];
 * dataClustered = [ [ 'sentence B0', 'sentence D4' ],
 * [ 'sentence A3', 'sentence C1', 'sentence D3' ],
 * [ 'sentence B2', 'sentence C0', 'sentence C4' ],
 * [ 'sentence A0', 'sentence B1', 'sentence C2', 'sentence C3' ],
 * [ 'sentence A2', 'sentence D0', 'sentence D1' ],
 * [ 'sentence A1', 'sentence B4' ],
 * [ 'sentence A4', 'sentence B3', 'sentence D2' ] ];
 * const csvData = getCsvData([tab1, tab2, tab3, tab4],
 [title1, title2, title3, title4], output);
 fs.writeFileSync('matriceConfusion/test2.csv', csvData);
 */
const getCsvData = (exceptedData, inputLabel, dataClustered) => {
  // C'est deg mais c'est comme ça
  const outputLabel = R.map(x => `Cluster ${x}`,
    [...new Array(dataClustered.length).keys()]);
  const outputData = [];
  for (let i = 0; i < exceptedData.length; i++) {
    outputData[i] = [];
    for (let j = 0; j < dataClustered.length; j++) {
      outputData[i][j] = 0;
    }
  }
  dataClustered.forEach((cluster, clusterIndex) => {
    cluster.forEach(sentence => {
      const inputIndex = getGroupIndex(exceptedData, sentence);
      outputData[inputIndex][clusterIndex] += 1;
    });
  });
  let outputStringBuffer = '\\';
  outputLabel.forEach(elm => {
    outputStringBuffer = outputStringBuffer.concat(`; ${elm}`);
  });
  outputStringBuffer = outputStringBuffer.concat('\n');
  outputData.forEach((line, index) => {
    outputStringBuffer = outputStringBuffer.concat(inputLabel[index]);
    line.forEach(elm => {
      outputStringBuffer = outputStringBuffer.concat(`; ${elm}`);
    });
    outputStringBuffer = outputStringBuffer.concat('\n');
  });
  console.log(outputStringBuffer);
  return outputStringBuffer;
};

module.exports = {getCsvData};
