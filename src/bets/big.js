'use strict';
const Bet = require('.').Bet;

class Big extends Bet {
  constructor(number) {
    if ([6, 8].indexOf(number) < 0) {
      throw 'Big bets are only defined for 6, and 8';
    }

    super({
      type: 'multi',
      houseEdge: 9,
      payout: {
        '*': 1
      }
    });

    this.selection = number;
  }

  evaluate(game) {
    if (this.selection === game.dice.value) {
      return true;
    } else if (7 === game.dice.value) {
      return false;
    }
  }
}

module.exports = Big;