'use strict';

class Bet {
  constructor(opts={}) {
    if (['prop', 'multi'].indexOf(opts.type) < 0) {
      throw new Error('Invalid bet type: '+opts.type);
    }

    if (opts.houseEdge <= 0 || opts.houseEdge >= 100) {
      throw new Error('House edge must be in range (0 and 100)');
    }

    this.type = opts.type;
    this.houseEdge = opts.houseEdge;
    this.payout = opts.payout;
  }

  evaluate() {
    console.warn('Bet evaluate method is meant to be overridden by a class which implements this interface');
  }
}

module.exports.Bet = Bet;


