'use strict';
const Bet = require('.').Bet;

class Horn extends Bet {
  constructor() {
    super({
      type: 'prop',
      houseEdge: 12.78, // this needs to be fixed this edge only applies to 2/12
      payout: {
        '2': (30/4),
        '3': (15/4),
        '11': (15/4),
        '12': (30/4)
      }
    });
  }

  evaluate(game) {
    return game.dice.value in this.payout;
  }
}

module.exports = Horn;