'use strict';
const Bet = require('.').Bet;

class AnyCraps extends Bet {
  constructor() {
    super({
      type: 'prop',
      houseEdge: 11.11,
      payout: {
        '*': 7
      }
    });
  }

  evaluate(roll) {
    if ([2, 3, 12].indexOf(roll) >= 0) {
      return true;
    }

    return false;
  }
}

module.exports = AnyCraps;