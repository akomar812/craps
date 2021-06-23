'use strict';
const Dealer = require('./dealer.js');
const Dice = require('./dice.js');
const Wagers = require('./wagers.js');

class Craps {
  constructor(opts={}) {
    this.debug = opts.debug || false;
    this.mode = opts.mode || 'single';
    this.Dealer = Dealer;
    this.dice = new Dice({ debug: this.debug });
    this.players = {};
    this.point = null;
  }

  addPlayer(name, pot=100) {
    if (name in this.players) {
      throw new Error(`A player named ${name} already exists`);
    }

    this.players[name] = { pot: pot, wagers: new Wagers() };
  }

  newGame() {
    this.point = null;

    for (let player in this.players) {
      this.players[player].wagers = new Wagers();
    }
  }
}

module.exports = Craps;

