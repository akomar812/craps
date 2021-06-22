'use strict';
const DicePair = require('./dice.js');
const Wagers = require('./wagers.js');

class Craps {
  constructor(opts={}) {
    this.debug = opts.debug || false;
    this.mode = opts.mode || 'single';
    this.dice = new DicePair({ debug: this.debug });
    this.payout = 0;
    this.point = null;
    this.wagers = {};

    if (this.mode === 'single') {
      this.wagers.player = new Wagers();
    }
  }
}

module.exports = Craps;

