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
    this.point = null;
    this.shooter = null;
  }

  addPlayer(name, pot=100) {
    if (name in this.players) {
      throw new Error(`A player named ${name} already exists`);
    }

    this.players[name] = { pot: pot, wagers: new Wagers() };

    if (this.shooter === null) {
      this.shooter = name;
    }
  }

  removePlayer(name) {
    delete this.players[name];
  }

  newGame() {
    const players = Object.keys(this.players);
    const nextPlayerIndex = mod(players.indexOf(this.shooter) + 1, players.length);
    this.point = null;

    for (let player in this.players) {
      this.players[player].wagers = new Wagers();
    }

    this.shooter = players[nextPlayerIndex];
  }
}

module.exports = Craps;

