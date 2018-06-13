const assert = require('assert');
const BloomF = require('../index.js');

const samples = [{ 
  n: 5, k: 3,
  inserted: [1, 4, 23], 
  tested: [1, 4, 23, 44, 33, 23], 
  expected: [true, true, true, false, false, true],
  desc: "three element insertion on small bloom filter"
}, {
  n: 200, k: 3,
  inserted: [1, 4, 23], 
  tested: [1, 4, 23, 44, 33, 23],
  expected: [true, true, true, false, false, true],
  desc: "three element insertion on relatively large bloom filter"
}, {
  n: 1000, k: 5,
  inserted: [1, 4, 23, 2, 3, 5, "rand", "x54sncj"], 
  tested: [1, 4, 23, 44, 33, 23, 23, "x54sncj"], 
  expected: [true, true, true, false, false, true, true, true],
  desc: "multiple element insertion (Numbers, Strings) on a large bloom filter"
}];


describe('hard coded insertion and checks test', () => {
  samples.forEach((sample) => {
    it(sample.desc, () => {
      const bl = new BloomF(sample.n, sample.k);
      sample.inserted.forEach((element) => bl.insert(element));
      const results = sample.tested.map((element) => bl.test(element));

      assert.deepEqual(results, sample.expected);
    });
  });
});