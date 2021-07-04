'use strict';
const Bet = require('.').Bet;

class DontPass extends Bet {
  constructor() {
    super({
      type: 'multi',
      houseEdge: 1.36,
      payout: {
        '2': 1,
        '3': 1,
        '12': 0,
        '*': 1
      }
    });
  }

  evaluate(game) {
    if (!game.point) {
      if ([7, 11].indexOf(game.dice.value) >= 0) {
        return false;
      } 

      if ([2, 3, 12].indexOf(game.dice.value) >= 0) {
        return true;
      }
    }

    if (game.point === game.dice.value) {
      return false;
    }

    if (game.dice.value === 7) {
      return true;
    }
  }

  // wagers should only be allowed when the point isn't set
  isAllowingWagers(game) {
    return game.point === null;
  }
}

module.exports = DontPass;