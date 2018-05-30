// TODO(khalil): assert on the hashes range of indexes.
module.exports = class BloomF {

  constructor(n, hashes) {
    this.filter = new Array(n);
    for (let i = 0; i < n; i++) {
      this.filter[i] = 0;
    }

    this.hashes = hashes;
  }

  // insert sets the bits of the indexes from the hashes
  insert(element){
    const indexes = this.hashes.map(hash => hash(element));
    indexes.map(i => this.filter[i] = 1, this);
  }

  // test checks whether the given element exists in the bloom filter.
  // it sums over all the target hashes in the filter and all the bits have to be one.
  // the number of ones should be equal to the number of hashing functions.
  test(element) {
    const indexes = this.hashes.map(hash => hash(element));
    const occurences = indexes.reduce((occurences, i) => occurences + this.filter[i], 0, this);
    return occurences == this.hashes.length;
  }
};