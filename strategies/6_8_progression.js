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
    if (game.players.player.wagers.place6 === 0 && game.players.player.wagers.place8 === 0) {
      if(this.debug) console.log('Placing 6/8 bets of size:', this.current * this.counter);
      game.players.player.wagers.place6 = this.current * this.counter;
      game.players.player.wagers.place8 = this.current * this.counter;
    }
  }

  afterRoll(game) {
    if (game.dice.value === 7) {
      if (game.players.player.wagers.place6 > 0 && game.players.player.wagers.place8 > 0) {
        this.counter++;
      } else if (game.players.player.wagers.place6 > 0) {
        this.counter = 1;
      } else if (game.players.player.wagers.place8 > 0) {
        this.counter = 1;
      }
    }
  }
}

module.exports = SixEightProgression;

