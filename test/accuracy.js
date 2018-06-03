const assert = require('assert');
const BloomF = require('../index');

function rand(rangeLimit) {
  return Math.floor(Math.random() * rangeLimit)
}

function generateTestData(insertionLimit, testLimit, valueLimit) {
  const inserted = [];
  for (let i = 0; i < insertionLimit; i++)
    inserted.push(rand(valueLimit));

  const tested = [];
  for (let i = 0; i < testLimit; i++)
    tested.push(rand(valueLimit));

  const found = new Set(inserted);
  const valid = tested.reduce((valid, element) => {
    return valid + (found.has(element) ? 1 : 0);
  }, 0);

  return {
    inserted: inserted,
    tested: tested,
    valid: valid
  };
}

it('false positive bloom filter test', () => {
  const SAMPLE_SIZE = 100,
        BL_SIZE = 10000,
        HASHES = 6,
        INSERTION_LIMIT = 500,
        TEST_LIMIT = 500,
        VALUE_LIMIT = 1000;

  let averageFP = 0;
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    const bl = new BloomF(BL_SIZE, HASHES);

    const test = generateTestData(INSERTION_LIMIT, TEST_LIMIT, VALUE_LIMIT);
    test.inserted.forEach((element) => bl.insert(element));
    const valid = test.tested.reduce((valid, element) => {
      return valid + (bl.test(element) ? 1 : 0);
    }, 0);

    const fp = (valid - test.valid) / TEST_LIMIT;
    averageFP += fp;
  }
  averageFP /= SAMPLE_SIZE;

  const theoreticalFP = 0.05;
  assert(averageFP <= theoreticalFP);
});