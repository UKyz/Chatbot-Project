const R = require('ramda');

class ResultSave {

  constructor(pathDirectory, nameOfMethode, headers) {
    this._pathDirectory = pathDirectory;
    this._nameOfMethode = nameOfMethode;
    this._data = [];
    this._headers = headers;
  }

  get data() {
    return this._data;
  }

  get headers() {
    return this._headers;
  }

  add(...line) {
    if (line.length !== this._headers.length) {
      throw new Error(
        'you must add ' + this._headers.length + ' elements and you add ' +
        line.length + ' elements');
    }
    // A refaire parce que peut-être mieux
    for (const i in line) {
      line[i] = R.pair(this._headers[i], line[i]);
    }

    this._data.push(R.fromPairs(line));
  }
}

const test = () => {
  let res = new ResultSave('out/', 'testMethode', ['type1', 'type2', 'type3']);
  res.add('coucou', 'hello', 'bite');
  res.add('coucou2', 'hello2', 'bite2');
  console.log(res.data);
};

test();