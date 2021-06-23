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
    this.payout = 0;
    this.point = null;
    this.wagers = {};
  }

  addPlayer(name) {
    if (name in this.wagers) {
      throw new Error(`A player named ${name} already exists`);
    }

    this.wagers[name] = new Wagers();
  }

  newGame() {
    this.payout = 0;
    this.point = null;

    for (let player in this.wagers) {
      this.wagers[player] = new Wagers();
    }
  }
}

module.exports = Craps;

