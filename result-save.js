const R = require('ramda');
const fs = require('fs-extra');
const dateFormat = require('dateformat');

const dataToCSV_ = R.pipe(
  R.map(R.pipe(
    R.values,
    R.join(';')
  )),
  R.join('\n')
);

const headerToCSV_ = R.pipe(
  R.join(';')
);

class ResultSave {
  constructor(pathDirectory, nameOfMethode, headers) {
    this._pathDirectory = pathDirectory;
    this._nameOfMethode = nameOfMethode;
    this._data = [];
    this._headers = headers;
  }

  add(...line) {
    if (line.length !== this._headers.length) {
      throw new Error(
        'you must add ' + this._headers.length + ' elements and you add ' +
        line.length + ' elements');
    }
    // A refaire parce que peut-être mieux
    for (const i in line) {
      if ({}.hasOwnProperty.call(i, line)) {
        line[i] = R.pair(this._headers[i], line[i]);
      }
    }
    this._data.push(R.fromPairs(line));
  }

  saveAsCsv() {
    const date = dateFormat(new Date(), '_dd-mm-yyyy_h:MM:ss');
    const dataToWrite = headerToCSV_(this._headers).concat('\n')
      .concat(dataToCSV_(this._data));
    fs.writeFileSync(
      this._pathDirectory.concat(this._nameOfMethode).concat(date)
        .concat('.csv'), dataToWrite);
  }

  saveAsJson() {
    const date = dateFormat(new Date(), '_dd-mm-yyyy_h:MM:ss');
    fs.writeFileSync(
      this._pathDirectory.concat(this._nameOfMethode).concat(date)
        .concat('.json'), JSON.stringify(this._data));
  }
}

const test = () => {
  const res = new ResultSave('out/', 'testMethode',
    ['type1', 'type2', 'type3']);
  res.add('coucou', 'hello', 'hey');
  res.add('coucou2', 'hello2', 'hey2');
  res.saveAsJson();
  res.saveAsCsv();
};

test();

module.exports = ResultSave;
