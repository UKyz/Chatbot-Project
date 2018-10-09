
function clearData(data) {
  let ret;
  let result = [];

  ret = data.replace(/é/gi, 'e');
  ret = ret.replace(/è/gi, 'e');
  ret = ret.replace(/ê/gi, 'e');
  ret = ret.replace(/à/gi, 'a');
  ret = ret.replace(/ç/gi, 'c');
  ret = ret.replace(/-/gi, '');
  ret = ret.toLowerCase().split(' ');
  for (let i in ret)
  {
    if (ret[i] != '' && ret[i].indexOf('\/') == -1)
      result.push(ret[i]);
  }
  return result;
}

function initObj(data) {
  let ret = {};

  data.forEach(e => {
    ret[e] = 0;
  });
  return ret;
}

function CalcResult(product, data) {
  let lendata = 0;
  let lenpdt = 0;
  let result = 0;
  let nbworddata = 0;

  for (let i in product) {
    lenpdt += product[i].length;
  }
  for (let key in data) {
    lendata += key.length;
    result += data[key];
    nbworddata++;
  }
  result = result / (nbworddata + (lenpdt / lendata));
  return result;
}

function CalculConfidence(product, data) {
  data = clearData(data);
  console.log(data + '\n');
  product = clearData(product);
  console.log(product + '\n');
  data = initObj(data);
  console.log(data);
  console.log(product);

  let i = 0;
  let j = 0;
  let k = 0;
  let rate = 0;
  let a = 0;

  for (let key in data)
  {
    i = 0;
    while (i < product.length) {
      j = 0;
      while (j < key.length) {
        a = j;
        k = 0;
        rate = 0;
        while (k < product[i].length && a < key.length) {
          if (product[i][k] == key[a])
            rate++;
          k++;
          a++;
        }
        rate = (product[i].length > key.length) ? rate / product[i].length :
          rate / key.length;
        if (rate > data[key])
          data[key] = rate;
        a = j;
        k = 0;
        rate = 0;
        while (k < key.length && a < product[i].length) {
          if (product[i][a] == key[k])
            rate++;
          k++;
          a++;
        }
        rate = (product[i].length > key.length) ? rate / product[i].length :
          rate / key.length;
        if (rate > data[key])
          data[key] = rate;
        j++;
      }
      i++;
    }
  }
  return (CalcResult(product, data));
}

/*console.log(CalculConfidence('Parquet contrecollé monolame chêne Montana - ' +
  'naturel brossé verni mat choix A/B - 1092x180 mm - ép. 14 mm', 'Parquet ' +
  'contrecollé monolame chêne Montana brossé'));*/

const p1 = 'Bonjour comment allez vous ?';
const p2 = 'Coucou ça va ? ';

console.log(CalculConfidence(p2, p1));
