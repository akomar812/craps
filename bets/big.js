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

  evaluate(dice) {
    if (this.selection === dice[0] + dice[1]) {
      return true;
    } else if (dice[0] + dice[1] === 7) {
      return false;
    }
  }
}

module.exports = Big;