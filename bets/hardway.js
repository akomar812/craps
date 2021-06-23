'use strict';
const Bet = require('.').Bet;

class HardWay extends Bet {
  constructor(number) {
    if ([4, 6, 8, 10].indexOf(number) < 0) {
      throw 'Hard way bets are only defined for 4, 6, 8, and 10';
    }

    super({
      type: 'multi',
      houseEdge: [6, 8].indexOf(number) >= 0 ? 9.09 : 11.11,
      payout: {
        '4': 7,
        '6': 9,
        '8': 9,
        '10': 7,
      }
    });

    this.selection = number;
  }

  evaluate(game) {
    if (this.selection === game.dice.value) {
      return game.dice.current[0] === game.dice.current[1];
    }
  }
}

module.exports = HardWay;