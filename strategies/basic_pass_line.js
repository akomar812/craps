'use strict';
const Strategy = require('.');

class BasicPassLine extends Strategy {
  constructor(opts={}) {
    super(opts);
    this.amount = opts.amount || 10;
  }

  beforeRoll(game) {
    if (game.on === null && game.wagers.pass === 0) {
      console.log('Placing pass line wager:', this.amount, 'current payout:', game.payout);
      game.wagers.pass = this.amount;
    }
  }
}

module.exports = BasicPassLine;

