'use strict';
const Bank = require('./bank.js');
const Dealer = require('./dealer.js');
const Dice = require('./dice.js');
const Wagers = require('./wagers.js');
const mod = require('./utils.js').mod;

class Craps {
  constructor(opts) {
    this.mode = opts.mode || 'single';
    this.db = opts.db;
    this.Dealer = Dealer;
    this.dice = new Dice();
    this.players = {};
    this.rotation = [];
    this.point = null;
    this.shooter = null;
    this.bank = new Bank({ Models: opts.Models });
  }

  init() {
    return this.bank.init().then(() => {
      if (this.mode === 'single') {
        this.Dealer.requestPlayerJoin(this, 'player');
      }
    });
  }

  addPlayer(name) {
    if (name in this.players) {
      throw new Error(`A player named ${name} already exists`);
    }

    this.players[name] = { pot: 0, wagers: new Wagers() };
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

