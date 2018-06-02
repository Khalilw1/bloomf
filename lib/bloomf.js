module.exports = class BloomF {
  constructor(n, k) {
    this.n = n;
    this.kHashes = k;
    this.filter = new Uint8Array(Math.ceil(n / 8));
  }

  toString(element) {
    // a quick hack to convert an {Number, String, Object?} to String
    return "" + element;
  }

  toByteArray(element) {
    let bytes = [];
    element = this.toString(element);
    for (let i = 0; i < element.length; i++) {
      const c = element.charAt(i);
      const converted = [c & 0xff, c / 256 >>> 0];
      bytes = bytes.concat(converted);
    };
    return bytes;
  }

  linear(element) {
    // Create a buffer of bytes for the given element.
    // This is used to handle any type of object hopefully.
    const buffer = this.toByteArray(element);
    return buffer.reduce((hash, byte) => {
      return (hash + byte * 1000000007 + 1000000009) % this.n;
    }, 0);
  }


  fnv(element) {
    const FNVOffset = 2166136261 % this.n;
    const FNVPrime = 16777619 % this.n;
    const buffer = this.toByteArray(element);

    return buffer.reduce((hash, byte) => {
      return (((hash * FNVPrime) % this.n) ^ byte) % this.n;
    }, FNVOffset);
  }

  // this generates all the necessary hashes for an element to be inserted in our set.
  generateHashes(element) {
    let hashes = [];
    for (let i = 0; i < this.kHashes; i++) {
      hashes.push((this.linear(element)+ i * this.fnv(element)) % this.n);
    }
    return hashes;
  }

  // insert sets the bits of the indexes from the hashes
  insert(element){
    const indexes = this.generateHashes(element);
    indexes.map(index => {
      const i = Math.floor(index / 8);
      const bit = index % 8;
      this.filter[i] |= (1 << bit);
    });
  }

  // test checks whether the given element exists in the bloom filter.
  // it sums over all the target hashes in the filter and all the bits have to be one.
  // the number of ones should be equal to the number of hashing functions.
  test(element) {
    const indexes = this.generateHashes(element);
    const occurences = indexes.reduce((occurences, index) => {
      const i = Math.floor(index / 8);
      const bit = index % 8;
      return occurences + ((this.filter[i] & (1 << (bit))) > 0 ? 1 : 0)
    }, 0);
    return occurences == this.kHashes;
  }
};