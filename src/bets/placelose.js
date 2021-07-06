'use strict';
const Bet = require('.').Bet;

class PlaceLose extends Bet {
  constructor(number) {
    if ([4, 5, 6, 8, 9, 10].indexOf(number) < 0) {
      throw 'Place bets are only defined for 4, 5, 6, 8, 9, and 10';
    }

    /**
     * TODO the house edge for this bet has 3 states which is unprecedented at this time
     * need to reevauate approach and use of this, will probably convert to function
     * edge definitions: 1.52% on 6 or 8; 4% on 5 or 9; 6.67% on 4 or 10
     */
    super({
      type: 'multi',
      houseEdge: .001,
      payout: {
        '4': (5/11),
        '5': (5/8), 
        '6': (4/5),
        '8': (4/5),
        '9': (5/8),
        '10': (5/11)
      }
    });

    this.selection = number;
  }

  evaluate(game) {
    if (this.selection === game.dice.value) {
      return false;
    } else if (7 === game.dice.value) {
      return true;
    }
  }
}

module.exports = PlaceLose;