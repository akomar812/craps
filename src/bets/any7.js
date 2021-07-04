'use strict';
const Bet = require('.').Bet;

class Any7 extends Bet {
  constructor() {
    super({
      type: 'prop',
      houseEdge: 16.67,
      payout: {
        '*': 4
      }
    });
  }

  evaluate(game) {
    if (game.dice.value === 7) {
      return true;
    }

    return false;
  }
}

module.exports = Any7;