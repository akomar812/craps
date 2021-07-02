'use strict';
const Bet = require('.').Bet;

class Odds extends Bet {
  constructor() {
    super({
      type: 'multi',
      houseEdge: 0,
      payout: {
        '4': 2,
        '5': (3/2),
        '6': (6/5),
        '8': (6/5),
        '9': (3/2),
        '10': 2
      }
    });
  }

  evaluate(game) {
    if (game.dice.value === 7) {
      return false;
    }

    if (game.point === game.dice.value) {
      return true;
    }
  }

  isAllowingWagers(game) {
    return game.point !== null;
  }
}

module.exports = Odds;