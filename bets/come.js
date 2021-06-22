'use strict';
const Bet = require('.').Bet;

class Come extends Bet {
  constructor() {
    super({
      type: 'multi',
      houseEdge: 1.41,
      payout: {
        '*': 1
      }
    });
  }

  evaluate(roll, point, comeWagers) {
    if (point) {
      const payoutRolls = [7, 11];

      if (comeWagers.point !== null) {
        payoutRolls.push(comeWagers.point);
      }

      if (payoutRolls.indexOf(roll) >= 0) {
        return true;
      } 

      if ([2, 3, 12].indexOf(roll) >= 0) {
        return false;
      }
    }
  }
}

module.exports = Come;