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

  evaluate(game) {
    if ([2, 3, 12].indexOf(game.dice.value) >= 0) {
      return true;
    }

    return false;
  }
}

module.exports = AnyCraps;