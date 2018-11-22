const getDataClusterized = ({phrases, tabTest}) => {
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
  return cluster;
};

/* eslint-disable-next-line require-await */
const clusterize = async msg => ({
  status: 200,
  body: JSON.stringify(getDataClusterized(JSON.parse(msg.body)))
});

module.exports = {clusterize};
