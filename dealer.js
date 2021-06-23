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
  static manage(game) {
    const results = {
      pass: bets.pass.evaluate(game.dice.value, game.point),
      dontpass: bets.dontpass.evaluate(game),
      // come: bets.come.evaluate(game.dice.value, game.point, game.wagers.come),
      field: bets.field.evaluate(game),
      place4: bets.place4.evaluate(game.dice.current),
      place5: bets.place5.evaluate(game.dice.current),
      place6: bets.place6.evaluate(game.dice.current),
      place8: bets.place8.evaluate(game.dice.current),
      place9: bets.place9.evaluate(game.dice.current),
      place10: bets.place10.evaluate(game.dice.current),
      big6: bets.big6.evaluate(game.dice.current),
      big8: bets.big8.evaluate(game.dice.current),
      hard4: bets.hard4.evaluate(game.dice.current),
      hard6: bets.hard6.evaluate(game.dice.current),
      hard8: bets.hard8.evaluate(game.dice.current),
      hard10: bets.hard10.evaluate(game.dice.current),
      two: bets.two.evaluate(game),
      three: bets.three.evaluate(game),
      eleven: bets.eleven.evaluate(game),
      twelve: bets.twelve.evaluate(game),
      any7: bets.any7.evaluate(game),
      anyCraps: bets.anyCraps.evaluate(game),
    };

    // multi-roll bets stay around until the bet conditions are met or a 7 is rolled
    if (results.pass !== undefined) {
      results.pass === true ? 
        this.payoutWin(game, game.players.player.wagers, bets.pass, 'pass') :
        this.payoutLoss(game, game.players.player.wagers, 'pass');

      game.point = null;
    } else if (game.point === null) {
      game.point = game.dice.value;
    }

    // if (results.come !== undefined) {
    //   results.come === true ?
    //     this.payoutWin(game, game.players.player.wagers.come, bets.come, 'pass') :
    //     this.payoutLoss(game, game.players.player.wagers.come, 'pass');
    // }

    for (let bet in bets) {
      if (['pass', 'come'].indexOf(bet) < 0) {
        if (bets[bet].type === 'multi') {
          if (results[bet] === true) {
            this.payoutWin(game, game.players.player.wagers, bets[bet], bet);
          } else if (results[bet] === false) {
            this.payoutLoss(game, game.players.player.wagers, bet);
          }
        } else {
          results[bet] === true ?
            this.payoutWin(game, game.players.player.wagers, bets[bet], bet) :
            this.payoutLoss(game, game.players.player.wagers, bet);
        }
      }
    }
  }

  static payoutWin(game, wagerBook, bet, wagerName) {
    const roll = game.dice.value;
    const payout = roll in bet.payout ? bet.payout[roll] : bet.payout['*'];
    const stake = wagerBook[wagerName];
    //console.log(wagerName, roll, payout, stake, game.payout)
    game.players.player.pot += (stake + (payout * stake));
    wagerBook[wagerName] = 0;
  }

  static payoutLoss(game, wagerBook, wagerName) {
    game.players.player.pot -= wagerBook[wagerName];
    wagerBook[wagerName] = 0;
  }

  static requestBet(game, wagerBook, name, amount) {
    if (game.players.player.pot < amount) {
      console.log(`Player's pot: ${game.players.player.pot} can not support bet: ${amount}`);
      return false;
    }

    if (bets[name].isAllowingWagers(game)) {
      wagerBook[name] += parseFloat(amount);
      return true;
    }

    return false;
  }
}

module.exports = Dealer;
