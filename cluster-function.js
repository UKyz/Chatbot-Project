const R = require('ramda');

const phrases = ['Je voudrais un ticket pour Lille',
  'J aimerais un billet pour Toulouse',
  'Un vol pour Amsterdam',
  'Un train vers Paris',
  'Voyager pendant deux semaines',
  'Un grand sejour au soleil',
  'De belles vacances tres loin pour se detendre',
  'La Bretagne c est trop genial',
  'Aujourdhui il fait vraiment tres beau'];

const nbMotsDansPhrase_ = R.pipe(
  R.split(' '),
  R.flatten,
  R.length,
);

const main = () => {
  const cluster = [];
  cluster.push([[phrases[0]]]);
  phrases.forEach(p => {
    if (phrases.indexOf(p) !== 0) {
      let test = false;
      cluster.forEach(cl => {
        cl.forEach(sousCl => {
          sousCl.forEach(pCl => {
            if (nbMotsDansPhrase_(p) === nbMotsDansPhrase_(pCl) &&
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

main();
