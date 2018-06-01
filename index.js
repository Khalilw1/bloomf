// TODO(khalil): assert on the hashes range of indexes.
module.exports = class BloomF {

  constructor(n, hashes) {
    // TODO(khalil): ceil of division is intended here.
    this.filter = new Uint32Array(Math.ceil(n / 32));

    for (let i = 0; i < n; i++) {
      this.filter[i] = 0;
    }

    this.hashes = hashes;
  }

  // insert sets the bits of the indexes from the hashes
  insert(element){
    const indexes = this.hashes.map(hash => hash(element));
    indexes.map(index => {
      const i = Math.floor(index / 32);
      const bit = index % 32;

      this.filter[i] |= (1 << bit);
    }, this);
  }

  // test checks whether the given element exists in the bloom filter.
  // it sums over all the target hashes in the filter and all the bits have to be one.
  // the number of ones should be equal to the number of hashing functions.
  test(element) {
    const indexes = this.hashes.map(hash => hash(element));
    const occurences = indexes.reduce((occurences, index) => {
      return occurences + ((this.filter[Math.floor(index / 32)] & (1 << (index % 32))) ? 1 : 0)
    }, 0, this);
    return occurences == this.hashes.length;
  }
};