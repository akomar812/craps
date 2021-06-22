'use strict';
const Place = require('./bets/place.js');
const Big = require('./bets/big.js');
const HardWay = require('./bets/hardway.js');
const Single = require('./bets/single.js');

const pass = new (require('./bets/pass.js'))();
const come = new (require('./bets/come.js'))();
const any7 = new (require('./bets/any7.js'))();
const anyCraps = new (require('./bets/anycraps.js'))();
const place4 = new Place(4);
const place5 = new Place(5);
const place6 = new Place(6);
const place8 = new Place(8);
const place9 = new Place(9);
const place10 = new Place(10);
const big6 = new Big(6);
const big8 = new Big(8);
const hard4 = new HardWay(4);
const hard6 = new HardWay(6);
const hard8 = new HardWay(8);
const hard10 = new HardWay(10);
const two = new Single(2);
const three = new Single(3);
const eleven = new Single(11);
const twelve = new Single(12);

class Dealer {
  static manage(game) {
    const passResult = pass.evaluate(game.dice.value, game.point);
    const comeResult = come.evaluate(game.dice.value, game.point, game.wagers.come);
    const place4Result = place4.evaluate(game.dice.current);
    const place5Result = place5.evaluate(game.dice.current);
    const place6Result = place6.evaluate(game.dice.current);
    const place8Result = place8.evaluate(game.dice.current);
    const place9Result = place9.evaluate(game.dice.current);
    const place10Result = place10.evaluate(game.dice.current);
    const big6Result = big6.evaluate(game.dice.current);
    const big8Result = big8.evaluate(game.dice.current);
    const hard4Result = hard4.evaluate(game.dice.current);
    const hard6Result = hard6.evaluate(game.dice.current);
    const hard8Result = hard8.evaluate(game.dice.current);
    const hard10Result = hard10.evaluate(game.dice.current);
    const twoResult = two.evaluate(game.dice.value);
    const threeResult = three.evaluate(game.dice.value);
    const elevenResult = eleven.evaluate(game.dice.value);
    const twelveResult = twelve.evaluate(game.dice.value);
    const any7Result = any7.evaluate(game.dice.value);
    const anyCrapsResult = anyCraps.evaluate(game.dice.value);

    // multi-roll bets stay around until the bet conditions are met or a 7 is rolled
    if (passResult !== undefined) {
      passResult === true ? 
        this.payoutWin(game, game.wagers, pass, 'pass') :
        this.payoutLoss(game, game.wagers, 'pass');

      game.point = null;
    } else if (game.point === null) {
      game.point = game.dice.value;
    }

    if (comeResult !== undefined) {
      comeResult === true ?
        this.payoutWin(game, game.wagers.come, come, 'pass') :
        this.payoutLoss(game, game.wagers.come, 'pass');
    }

    if (place4Result === true) {
      this.payoutWin(game, game.wagers.place, place4, '4');
    } else if (place4Result === false) {
      this.payoutLoss(game, game.wagers.place, '4');
    }

    if (place5Result === true) {
      this.payoutWin(game, game.wagers.place, place5, '5');
    } else if (place5Result === false) {
      this.payoutLoss(game, game.wagers.place, '5');
    }

    if (place6Result === true) {
      this.payoutWin(game, game.wagers.place, place6, '6');
    } else if (place6Result === false) {
      this.payoutLoss(game, game.wagers.place, '6');
    }

    if (place8Result === true) {
      this.payoutWin(game, game.wagers.place, place8, '8');
    } else if (place8Result === false) {
      this.payoutLoss(game, game.wagers.place, '8');
    }

    if (place9Result === true) {
      this.payoutWin(game, game.wagers.place, place9, '9');
    } else if (place9Result === false) {
      this.payoutLoss(game, game.wagers.place, '9');
    }

    if (place10Result === true) {
      this.payoutWin(game, game.wagers.place, place10, '10');
    } else if (place10Result === false) {
      this.payoutLoss(game, game.wagers.place, '10');
    }

    if (big6Result === true) {
      this.payoutWin(game, game.wagers.big, big6, '6');
    } else if (big6Result === false) {
      this.payoutLoss(game, game.wagers.big, '6');
    }

    if (big8Result === true) {
      this.payoutWin(game, game.wagers.big, big8, '8');
    } else if (big8Result === false) {
      this.payoutLoss(game, game.wagers.big, '8');
    }

    if (hard4Result === true) {
      this.payoutWin(game, game.wagers.hard, hard4, '4');
    } else if (hard4Result === false) {
      this.payoutLoss(game, game.wagers.hard, '4');
    }

    if (hard6Result === true) {
      this.payoutWin(game, game.wagers.hard, hard6, '6');
    } else if (hard6Result === false) {
      this.payoutLoss(game, game.wagers.hard, '6');
    }

    if (hard8Result === true) {
      this.payoutWin(game, game.wagers.hard, hard8, '8');
    } else if (hard8Result === false) {
      this.payoutLoss(game, game.wagers.hard, '8');
    }

    if (hard10Result === true) {
      this.payoutWin(game, game.wagers.hard, hard10, '10');
    } else if (hard10Result === false) {
      this.payoutLoss(game, game.wagers.hard, '10');
    }

    // Prop bets fail or succeed and then disappear
    twoResult === true ?
      this.payoutWin(game, game.wagers, two, 'two') :
      this.payoutLoss(game, game.wagers, 'two');

    threeResult === true ?
      this.payoutWin(game, game.wagers, three, 'three') :
      this.payoutLoss(game, game.wagers, 'three');

    elevenResult === true ?
      this.payoutWin(game, game.wagers, eleven, 'eleven') :
      this.payoutLoss(game, game.wagers, 'eleven');

    twelveResult === true ?
      this.payoutWin(game, game.wagers, twelve, 'twelve') :
      this.payoutLoss(game, game.wagers, 'twelve');

    any7Result === true ?
      this.payoutWin(game, game.wagers, any7, 'any7') :
      this.payoutLoss(game, game.wagers, 'any7');

    anyCrapsResult === true ?
      this.payoutWin(game, game.wagers, anyCraps, 'anyCraps') :
      this.payoutLoss(game, game.wagers, 'anyCraps');
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