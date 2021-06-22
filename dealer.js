'use strict';
const Place = require('./bets/place.js');
const Big = require('./bets/big.js');
const HardWay = require('./bets/hardway.js');
const Single = require('./bets/single.js');

const bets = {
  pass: new (require('./bets/pass.js'))(),
  // come: new (require('./bets/come.js'))(),
  any7: new (require('./bets/any7.js'))(),
  anyCraps: new (require('./bets/anycraps.js'))(),
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
      // come: bets.come.evaluate(game.dice.value, game.point, game.wagers.come),
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
      two: bets.two.evaluate(game.dice.value),
      three: bets.three.evaluate(game.dice.value),
      eleven: bets.eleven.evaluate(game.dice.value),
      twelve: bets.twelve.evaluate(game.dice.value),
      any7: bets.any7.evaluate(game),
      anyCraps: bets.anyCraps.evaluate(game),
    }

    // multi-roll bets stay around until the bet conditions are met or a 7 is rolled
    if (results.pass !== undefined) {
      results.pass === true ? 
        this.payoutWin(game, game.wagers.player, bets.pass, 'pass') :
        this.payoutLoss(game, game.wagers.player, 'pass');

      game.point = null;
    } else if (game.point === null) {
      game.point = game.dice.value;
    }

    // if (results.come !== undefined) {
    //   results.come === true ?
    //     this.payoutWin(game, game.wagers.player.come, bets.come, 'pass') :
    //     this.payoutLoss(game, game.wagers.player.come, 'pass');
    // }

    for (let bet in bets) {
      if (['pass', 'come'].indexOf(bet) < 0) {
        if (bets[bet].type === 'multi') {
          const betNum = bet.match(/\d+/g);
          const betName =  bet.match(/[a-zA-Z]+/g);

          if (results[bet] === true) {
            this.payoutWin(game, game.wagers.player[betName], bets[bet], betNum);
          } else if (results[bet] === false) {
            this.payoutLoss(game, game.wagers.player[betName], betNum);
          }
        } else {
          results[bet] === true ?
          this.payoutWin(game, game.wagers.player, bets[bet], bet) :
          this.payoutLoss(game, game.wagers.player, bet);
        }
      }
    }
  }

  static payoutWin(game, wagerBook, bet, wagerName) {
    const roll = game.dice.value;
    const payout = roll in bet.payout ? bet.payout[roll] : bet.payout['*'];
    const stake = wagerBook[wagerName];
    //console.log(roll, payout, stake, game.payout)
    game.payout += (stake + (payout * stake));
    wagerBook[wagerName] = 0;
  }

  static payoutLoss(game, wagerBook, wagerName) {
    game.payout -= wagerBook[wagerName];
    wagerBook[wagerName] = 0;
  }
}

module.exports = Dealer;
