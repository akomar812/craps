'use strict';
/*
  Interface for implementing craps strategies. Exposes hooks that are called once before each roll
  and once after each roll.
*/

class Strategy {
  constructor(opts={}) {
    this.debug = opts.debug || false;
  }

  beforeRoll() {
  }

  afterRoll() {
  }
}

module.exports = Strategy;
