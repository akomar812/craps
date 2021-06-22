'use strict';
const Bet = require('.').Bet;

class Single extends Bet {
  constructor(number) {
    if ([2, 3, 11, 12].indexOf(number) < 0) {
      throw 'Single bets are only defined for 2, 3, 11, and 12';
    }

    super({
      type: 'prop',
      houseEdge: [2, 12].indexOf(number) >= 0 ? 13.89 : 11.11,
      payout: {
        '2': 30,
        '3': 15,
        '11': 15,
        '12': 30,
      }
    });

    this.selection = number;
  }

  evaluate(roll) {
    if (this.selection === roll) {
      return true;
    }

    return false;
  }
}

module.exports = Single;