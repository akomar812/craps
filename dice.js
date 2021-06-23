'use strict';

class DicePair {
  constructor(opts={}) {
    this.debug = opts.debug || false;
    this.current = [];
    this.value = 0;
  }

  static _getRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  roll() {
    this.current = [DicePair._getRoll(), DicePair._getRoll()];
    this.value = this.current[0] + this.current[1];
    if (this.debug) console.log('Rolled:', this.value, this.current);
    return this;
  }
}

module.exports = DicePair;

