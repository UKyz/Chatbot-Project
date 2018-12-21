const plotly = require('plotly')('A1c0', 'qzINrviT0hYEfiXVQJ2Q');
const R = require('ramda');

const renameKeys_ = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {},
    R.keys(obj))
);

const transform_ = R.curry(
  (trans, data) => R.map(R.map(renameKeys_(trans)))(data));

/* Const rgbList = [
  'rgb(230, 25, 75)',
  'rgb(245, 130, 48)',
  'rgb(255, 225, 25)',
  'rgb(210, 245, 60)',
  'rgb(60, 180, 75)',
  'rgb(70, 240, 240)',
  'rgb(0, 130, 200)',
  'rgb(145, 30, 180)',
  'rgb(240, 50, 230)',
  'rgb(128, 128, 128)'
]; */

const randInt = (min, max) => Math.floor(
  Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);

const randRgb = () => `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0,
  255)})`;

const groupKey_ = x => {
  return R.pipe(
    R.assoc('text', R.pluck('text', x)),
    R.assoc('x', R.pluck('x', x)),
    R.assoc('y', R.pluck('y', x)),
  )({});
};

const getTrace_ = (data, tabEqu) => {
  const dataPrepared = getDataPrepared_(data, tabEqu);
  const trace = [];
  for (const i in dataPrepared) {
    if (Object.prototype.hasOwnProperty.call(dataPrepared, i)) {
      trace.push({
        x: dataPrepared[i].x,
        y: dataPrepared[i].y,
        mode: 'markers',
        name: `Cluster ${i}`,
        text: dataPrepared[i].text,
        marker: {
          color: randRgb(),
          size: 12,
          line: {
            color: 'white',
            width: 0.5
          }
        },
        type: 'scatter'
      });
    }
  }
  return trace;
};

const getDataPrepared_ = (data, tabEqu) => R.pipe(
  transform_(tabEqu),
  R.map(groupKey_),
)(data);

const getOption_ = info => ({
  layout: {
    title: `${info.text} clustering by ${info.x} and ${info.y}`,
    xaxis: {
      title: info.x,
      showgrid: true,
      zeroline: true
    },
    yaxis: {
      title: info.y,
      showline: true,
      zeroline: true
    }
  },
  filename: 'line-style',
  fileopt: 'overwrite'
});
/**
 * Plot data with plot.ly
 * @param {Object} dataSet the data which is
 * @param {Object} tabEqu the table of equivalence
 * @example
 *
 *
 * const dataSet = [
 *   [
 *     {company: 'Microsoft', size: 91259, revenue: 60420},
 *     {company: 'SAP', size: 48000, revenue: 11567}
 *   ],
 *   [
 *     {company: 'Skype', size: 700, revenue: 716},
 *     {company: 'Yahoo!', size: 14000, revenue: 6426},
 *     {company: 'eBay', size: 15000, revenue: 8700}
 *   ],
 *   [
 *     {company: 'IBM', size: 400000, revenue: 98787}
 *   ]
 * ];
 * const eqTab = {company: 'text', size: 'x', revenue: 'y'};
 * plotDataClustered(dataSet, tabEq);
 */
const plotDataClustered = (dataSet, tabEqu) => {
  const data = getTrace_(dataSet, tabEqu);
  const option = getOption_(R.invertObj(tabEqu));
  plotly.plot(data, option, (err, msg) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`data's graph: ${msg.url}`);
    }
  });
};

module.exports = {plotDataClustered};
