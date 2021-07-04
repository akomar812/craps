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

  evaluate(game) {
    if (!game.point) {
      if ([7, 11].indexOf(game.dice.value) >= 0) {
        return true;
      } 

      if ([2, 3, 12].indexOf(game.dice.value) >= 0) {
        return false;
      }
    }

    if (game.point === game.dice.value) {
      return true;
    }

    if (7 === game.dice.value) {
      return false;
    }
  }

  // wagers should only be allowed when the point isn't set
  isAllowingWagers(game) {
    return game.point === null;
  }
}

module.exports = Pass;