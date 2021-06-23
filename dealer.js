'use strict';
const Place = require('./bets/place.js');
const Big = require('./bets/big.js');
const HardWay = require('./bets/hardway.js');
const Single = require('./bets/single.js');

const bets = {
  pass: new (require('./bets/pass.js'))(),
  dontpass: new (require('./bets/dontpass.js'))(),
  // come: new (require('./bets/come.js'))(),
  any7: new (require('./bets/any7.js'))(),
  anyCraps: new (require('./bets/anycraps.js'))(),
  field: new (require('./bets/field.js'))(),
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
  twelve: new Single(12),
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

    // if (results.come !== undefined) {
    //   results.come === true ?
    //     this.payoutWin(game, player, 'pass') :
    //     this.payoutLoss(game, player, 'pass');
    // }

    for (let player in game.players) {
      for (let bet in bets) {
        if (bets[bet].type === 'multi') {
          if (results[bet] === true) {
            this.payoutWin(game, player, bet);
          } else if (results[bet] === false) {
            this.payoutLoss(game, player, bet);
          }
        } else {
          results[bet] === true ?
            this.payoutWin(game, player, bet) :
            this.payoutLoss(game, player, bet);
        }
      }
    }

    if (results.pass !== undefined) {
      game.point = null;
    } else if (game.point === null) {
      game.point = game.dice.value;
    }
  }

  static payoutWin(game, player, bet) {
    const roll = game.dice.value;
    const payout = roll in bets[bet].payout ? bets[bet].payout[roll] : bets[bet].payout['*'];
    const stake = game.players[player].wagers[bet];
    game.players[player].pot += (stake + (payout * stake));
    game.players[player].wagers[bet] = 0;
  }

  static payoutLoss(game, player, bet) {
    game.players[player].pot -= game.players[player].wagers[bet];
    game.players[player].wagers[bet] = 0;
  }

  static requestBet(game, player, bet, amount) {
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

module.exports = Dealer;
