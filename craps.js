'use strict';
const Dealer = require('./dealer.js');
const Dice = require('./dice.js');
const Wagers = require('./wagers.js');

const mod = (n, m) => {
  return ((n%m)+m)%m;
};

class Craps {
  constructor(opts={}) {
    this.debug = opts.debug || false;
    this.mode = opts.mode || 'single';
    this.Dealer = Dealer;
    this.dice = new Dice({ debug: this.debug });
    this.players = {};
    this.saved = {};
    this.rotation = [];
    this.point = null;
    this.shooter = null;

    if (this.mode === 'single') {
      this.addPlayer('player');
      this.shooter = 'player';
    }
  }

  addPlayer(name, pot=100) {
    if (name in this.players) {
      throw new Error(`A player named ${name} already exists`);
    }

    this.players[name] = { pot: pot, wagers: new Wagers() };
  }

  newGame() {
    const nextPlayerIndex = mod(this.rotation.indexOf(this.shooter) + 1, this.rotation.length);
    this.point = null;

    for (let player in this.players) {
      this.players[player].wagers = new Wagers();
    }

    if (this.mode === 'multi') this.shooter = this.rotation[nextPlayerIndex];
  }
}

module.exports = Craps;

