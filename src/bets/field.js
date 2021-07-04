'use strict';
const Bet = require('.').Bet;
const validFieldBets = [2, 3, 4, 9, 10, 11, 12];

class Field extends Bet {
  constructor() {
    super({
      type: 'prop',
      houseEdge: 5.5,
      payout: {
        '2': 2,
        '3': 1,
        '4': 1,
        '9': 1,
        '10': 1,
        '11': 1,
        '12': 2,
      }
    });
  }

  evaluate(game) {
    return validFieldBets.indexOf(game.dice.value) >= 0;
  }
}

module.exports = Field;