module.exports = class BitSet {
  constructor(n) {
    this.buffer = new Uint8Array(Math.ceil(n / 8));
  }

  set(index) {
    const i = Math.floor(index / 8);
    const bit = index % 8; 
    this.buffer[i] |= (1 << bit);
  }

  get(index) {
    const i = Math.floor(index / 8);
    const bit = index % 8;
    return (this.buffer[i] >> bit) & 1;
  }
}