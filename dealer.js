'use strict';
const Place = require('./bets/place.js');
const Big = require('./bets/big.js');
const HardWay = require('./bets/hardway.js');
const Single = require('./bets/single.js');
const mod = require('./utils.js').mod;

const bets = {
  pass: new (require('./bets/pass.js'))(),
  dontpass: new (require('./bets/dontpass.js'))(),
  // come: new (require('./bets/come.js'))(),
  any7: new (require('./bets/any7.js'))(),
  anyCraps: new (require('./bets/anycraps.js'))(),
  field: new (require('./bets/field.js'))(),
  odds: new (require('./bets/odds.js'))(),
  horn: new (require('./bets/horn.js'))(),
  place4: new Place(4),
  place5: new Place(5),
  place6: new Place(6),
  place8: new Place(8),
  place9: new Place(9),
  place10: new Place(10),
  big6: new Big(6),
  big8: new Big(8),
  hard4: new HardWay(4),
  hard6: new HardWay(6),
  hard8: new HardWay(8),
  hard10: new HardWay(10),
  two: new Single(2),
  three: new Single(3),
  eleven: new Single(11),
  twelve: new Single(12)
};

class Dealer {
  static getBets() {
    return bets;
  }

  static manage(game) {
    const results = {};

    for (let bet in bets) {
      results[bet] = bets[bet].evaluate(game);
    }

    for (let player in game.players) {
      for (let bet in bets) {
        if (bets[bet].type === 'multi') {
          if (results[bet] === true) {
            this.payoutWin(game, player, bet);
          } else if (results[bet] === false) {
            this.payoutLoss(game, player, bet);
          }
        } else {
          results[bet] === true?
            this.payoutWin(game, player, bet) :
            this.payoutLoss(game, player, bet);
        }
      }
    }

    if (results.pass !== undefined) {
      game.point = null;

      if (game.dice.value === 7) {
        game.newGame();
      }
    } else if (game.point === null) {
      game.point = game.dice.value;
    }
  }

  static keepAlive(game, player) {
    if (player in game.players) {
      if (game.players[player].timeout) clearTimeout(game.players[player].timeout);

      game.players[player].timeout = setTimeout(() => {
        this.requestPlayerRemoval(game, player);
      }, 300000);
    }
  }

  static payoutWin(game, player, bet) {
    const roll = game.dice.value;
    const payout = roll in bets[bet].payout ? bets[bet].payout[roll] : bets[bet].payout['*'];
    const stake = game.players[player].wagers[bet];

    if (stake > 0) {
      game.players[player].pot += (stake + (payout * stake));
      game.players[player].wagers[bet] = 0;
    }
  }

  static payoutLoss(game, player, bet) {
    if (game.players[player].wagers[bet] > 0) {
      game.players[player].pot -= game.players[player].wagers[bet];
      game.players[player].wagers[bet] = 0;
    }
  }

  static async requestPlayerJoin(game, player) {
    game.addPlayer(player);

    // start new players with 100
    if (!(player in game.bank.deposits)) {
      await game.bank.handleDeposit(player, 100);
    }

    if (game.rotation.length === 0) {
      game.shooter = player;
    }

    game.rotation.push(player);
    Dealer.keepAlive(game, player);
  }

  static async requestPlayerRemoval(game, player) {
    if (player in game.players) {
      await game.bank.handleDeposit(player, game.players[player].pot);

      if (game.shooter === player) {
        if (Object.keys(game.players).length > 1) {
          const nextPlayerIndex = mod(game.rotation.indexOf(game.shooter) + 1, game.rotation.length);
          game.shooter = game.rotation[nextPlayerIndex];
        } else {
          game.shooter = null;
          game.point = null;
        }
      }

      if (game.players[player].timeout) clearTimeout(game.players[player].timeout);
      delete game.players[player];

      game.rotation.splice(game.rotation.indexOf(player), 1);
    }
  }

  static requestBet(game, player, bet, amount) {
    if (player in game.players) {
      if (game.players[player].pot < amount) {
        console.log(`Player's pot: ${game.players[player].pot} cannot support bet: ${amount}`);
        return false;
      }
  
      if (bets[bet].isAllowingWagers(game)) {
        game.players[player].wagers[bet] += parseFloat(amount);
        return true;
      }
  
      return false;
    }
  }
}

module.exports = Dealer;
