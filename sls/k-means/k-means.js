const turf = require('@turf/turf');
const R = require('ramda');

const renameKeys_ = R.curry((keysMap, obj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {},
    R.keys(obj))
);

const transform_ = R.curry((trans, data) => R.map(renameKeys_(trans))(data));

const baba1 = item => ({
  type: 'Feature',
  properties: item,
  geometry: {coordinates: [item.x, item.y], type: 'Point'}
});

const baba2 = item => ({type: 'FeatureCollection', features: item});

const preparedata = R.curry((tableEq, data) => R.pipe(
  transform_(tableEq),
  R.map(baba1),
  baba2
)(data));

const getResult = R.pipe(
  R.prop('features'),
  R.map(R.pipe(
    R.prop('properties'),
    R.dissoc('centroid')
  )),
  R.groupBy(R.prop('cluster')),
  R.values,
  R.map(R.map(R.dissoc('cluster'))),
);

const clustering = R.curry((nbClusters, data) => turf.clustersKmeans(data,
  {numberOfClusters: nbClusters}));

const kmeans = (data, tableEq, nbClusters) => R.pipe(
  preparedata(tableEq),
  clustering(nbClusters),
  getResult,
  R.map(transform_(R.invertObj(tableEq))),
)(data);

/* eslint-disable-next-line require-await */
const kmeansMethod = async msg => ({
  status: 200,
  body: JSON.stringify(kmeans(JSON.parse(msg.body)))
});

module.exports = {kmeansMethod, kmeans};
