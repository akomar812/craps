'use strict';
const Strategy = require('.');

class SixEightProgression extends Strategy {
  constructor(opts={}) {
    super(opts);
    this.counter = 0;
    this.min = 10;
    this.current = 10;
  }

  beforeRoll(game) {
    if (game.wagers.place['6'] === 0 && game.wagers.place['8'] === 0) {
      if(this.debug) console.log('Placing 6/8 bets of size:', this.current * this.counter);
      game.wagers.place['6'] = this.current * this.counter;
      game.wagers.place['8'] = this.current * this.counter;
    }
  }

  afterRoll(game) {
    if (game.dice.value === 7) {
      if (game.wagers.place['6'] > 0 && game.wagers.place['8'] > 0) {
        this.counter++;
      } else if (game.wagers.place['6'] > 0) {
        this.counter = 1;
      } else if (game.wagers.place['8'] > 0) {
        this.counter = 1;
      }
    }
  }
}

module.exports = SixEightProgression;

