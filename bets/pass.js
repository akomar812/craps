'use strict';
const Bet = require('.').Bet;

class Pass extends Bet {
  constructor() {
    super({
      type: 'multi',
      houseEdge: 1.41,
      payout: {
        '*': 1
      }
    });
  }

  evaluate(roll, point) {
    if (!point) {
      if ([7, 11].indexOf(roll) >= 0) {
        return true;
      } 

      if ([2, 3, 12].indexOf(roll) >= 0) {
        return false;
      }
    }

    if (point === roll) {
      return true;
    }

    if (roll === 7) {
      return false;
    }
  }
}

module.exports = Pass;