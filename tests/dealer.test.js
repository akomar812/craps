'use strict';
const Dealer = require('../dealer.js');
const Wagers = require('../wagers.js');
const pass = new (require('../bets/pass.js'))();
const utils = require('./utils.js');

const newGameStub = (roll, pointValue=null, wagers={}) => {
  return {
    dice: { value: roll[0]+roll[1], current: roll },
    point: pointValue,
    payout: 0,
    wagers: {
      player: Object.assign({
        ...new Wagers(),
        ...wagers
      })
    }
  };
};

const basicPassWager = () => {
  return { pass: 10 };
};

// const basicComeWager = () => {
//   return { come: { pass: 10, point: null } };
// };

const basicPlaceWager = (bet) => {
  return { place4: 0, place5: 0, place6: 0, place8: 0, place9: 0, place10: 0, ...{ [bet]: 10 } };
};

const basicBigWager = (bet) => {
  return { big6: 0, big8: 0, ...{ [bet]: 10 } };
};

const basicHardWager = (bet) => {
  return { hard4: 0, hard6: 0, hard8: 0, hard10: 0, ...{ [bet]: 10 } };
};

const basicNamedWager = (name) => {
  return { [name]: 10 };
};

const multiBetTest = (bet, wagerConfig, payoutFn) => {
  return () => {
    for (let i=1; i<=6; i++) {
      for (let j=1; j<=6; j++) {
        const game = newGameStub([i, j], utils.getRandomPoint(), wagerConfig);
        Dealer.manage(game);
        const expected = payoutFn([i, j]);
        expect(game.payout).toBe(expected[0]);
        expect(game.wagers.player[bet]).toBe(expected[1]);
      }
    }
  };
};

const propBetTest = (bet, wagerConfig, payoutFn) => {
  return () => {
    for (let i=1; i<=6; i++) {
      for (let j=1; j<=6; j++) {
        const game = newGameStub([i, j], utils.getRandomPoint(), wagerConfig);
        Dealer.manage(game);
        expect(game.payout).toBe(payoutFn(i+j));
        expect(game.wagers.player[bet]).toBe(0);
      }
    }
  };
};

test('win payout', () => {
  const game = newGameStub([0, 0], null, basicPassWager());
  Dealer.payoutWin(game, game.wagers.player, pass, 'pass');
  expect(game.payout).toBe(20);
  expect(game.wagers.player.pass).toBe(0);
});

test('loss payout', () => {
  const game = newGameStub([0, 0], null, basicPassWager());
  Dealer.payoutLoss(game, game.wagers.player, 'pass');
  expect(game.payout).toBe(-10);
  expect(game.wagers.player.pass).toBe(0);
});

test('pass bet win when point is off', () => {
  const game = newGameStub([3, 4], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.player.pass).toBe(0);
});

test('pass bet lose when point is off', () => {
  const game = newGameStub([1, 1], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.player.pass).toBe(0);
});

test('pass bet open when point is off', () => {
  const game = newGameStub([2, 3], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(5);
  expect(game.wagers.player.pass).toBe(10);
});

test('pass bet win when point is on', () => {
  const game = newGameStub([3, 3], 6, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.player.pass).toBe(0);
});

test('pass bet lose when point is on', () => {
  const game = newGameStub([6, 1], 10, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.player.pass).toBe(0);
});

test('pass bet no op when point is on', () => {
  const game = newGameStub([6, 4], utils.getRandomPoint(), basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(game.point);
  expect(game.wagers.player.pass).toBe(10);
});

test('don\'t pass bet lose when point is off', () => {
  const game = newGameStub([3, 4], null, basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.player.dontpass).toBe(0);
});

test('don\'t pass bet win when point is off', () => {
  const game = newGameStub([1, 1], null, basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.player.dontpass).toBe(0);
});

test('don\'t pass bet push when point is off', () => {
  const game = newGameStub([6, 6], null, basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(10);
  expect(game.point).toBe(null);
  expect(game.wagers.player.dontpass).toBe(0);
});

test('don\'t pass bet open when point is off', () => {
  const game = newGameStub([2, 3], null, basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(5);
  expect(game.wagers.player.dontpass).toBe(10);
});

test('don\'t pass bet lose when point is on', () => {
  const game = newGameStub([3, 3], 6, basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.player.dontpass).toBe(0);
});

test('don\'t pass bet win when point is on', () => {
  const game = newGameStub([6, 1], utils.getRandomPoint(), basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.player.dontpass).toBe(0);
});

test('don\'t pass bet no op when point is on', () => {
  const game = newGameStub([6, 4], utils.getRandomPoint(), basicNamedWager('dontpass'));
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(game.point);
  expect(game.wagers.player.dontpass).toBe(10);
});


// test('come bet win', () => {
//   const game = newGameStub([5, 2], 5, basicComeWager());
//   Dealer.manage(game);
//   expect(game.payout).toBe(20);
//   expect(game.point).toBe(null);
//   expect(game.wagers.player.come.pass).toBe(0);
//   expect(game.wagers.player.come.point).toBe(null);
// });

// test('come bet lose', () => {
//   const game = newGameStub([2, 1], 8, basicComeWager());
//   Dealer.manage(game);
//   expect(game.payout).toBe(-10);
//   expect(game.point).toBe(8);
//   expect(game.wagers.come.pass).toBe(0);
//   expect(game.wagers.come.point).toBe(null);
// });

// test('come bet open', () => {
//   const game = newGameStub(5, 9, basicComeWager());
//   Dealer.manage(game);
//   expect(game.payout).toBe(0);
//   expect(game.point).toBe(9);
//   expect(game.wagers.come.pass).toBe(0);
//   expect(game.wagers.come.point).toBe([5, 10]);
// });

// test('come bet hit point', () => {
//   const game = newGameStub(5);
//   Dealer.manage(game);
//   expect(game.payout).toBe(0);
//   expect(game.point).toBe(5);
// });

test('place 4 bet', multiBetTest('place4', basicPlaceWager('place4'), (dice) => {
  if (dice[0] + dice[1] === 4) return [10 + (10 * (9/5)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('place 5 bet', multiBetTest('place5', basicPlaceWager('place5'), (dice) => {
  if (dice[0] + dice[1] === 5) return [10 + (10 * (7/5)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('place 6 bet', multiBetTest('place6', basicPlaceWager('place6'), (dice) => {
  if (dice[0] + dice[1] === 6) return [10 + (10 * (7/6)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('place 8 bet', multiBetTest('place8', basicPlaceWager('place8'), (dice) => {
  if (dice[0] + dice[1] === 8) return [10 + (10 * (7/6)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('place 9 bet', multiBetTest('place9', basicPlaceWager('place9'), (dice) => {
  if (dice[0] + dice[1] === 9) return [10 + (10 * (7/5)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('place 10 bet', multiBetTest('place10', basicPlaceWager('place10'), (dice) => {
  if (dice[0] + dice[1] === 10) return [10 + (10 * (9/5)), 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('big 6 bet', multiBetTest('big6', basicBigWager('big6'), (dice) => {
  if (dice[0] + dice[1] === 6) return [20, 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('big 8 bet', multiBetTest('big8', basicBigWager('big8'), (dice) => {
  if (dice[0] + dice[1] === 8) return [20, 0];
  else if (dice[0] + dice[1] === 7) return [-10, 0];
  else return [0, 10];
}));

test('hard 4 bet', multiBetTest('hard4', basicHardWager('hard4'), (dice) => {
  const ex = utils.getHardWayExpectedValue(dice[0], dice[1], 4);

  if (ex === true) return [80, 0];
  else if (ex === false) return [-10, 0];
  else return [0, 10];
}));


test('hard 6 bet', multiBetTest('hard6', basicHardWager('hard6'), (dice) => {
  const ex = utils.getHardWayExpectedValue(dice[0], dice[1], 6);

  if (ex === true) return [100, 0];
  else if (ex === false) return [-10, 0];
  else return [0, 10];
}));

test('hard 8 bet', multiBetTest('hard8', basicHardWager('hard8'), (dice) => {
  const ex = utils.getHardWayExpectedValue(dice[0], dice[1], 8);

  if (ex === true) return [100, 0];
  else if (ex === false) return [-10, 0];
  else return [0, 10];
}));

test('hard 10 bet', multiBetTest('hard10', basicHardWager('hard10'), (dice) => {
  const ex = utils.getHardWayExpectedValue(dice[0], dice[1], 10);

  if (ex === true) return [80, 0];
  else if (ex === false) return [-10, 0];
  else return [0, 10];
}));

test('2 bet', propBetTest('two', basicNamedWager('two'), (roll) => {
  return roll === 2 ? 310 : -10;
}));

test('3 bet', propBetTest('three', basicNamedWager('three'), (roll) => {
  return roll === 3 ? 160 : -10;
}));

test('11 bet', propBetTest('eleven', basicNamedWager('eleven'), (roll) => {
  return roll === 11 ? 160 : -10;
}));

test('12 bet', propBetTest('twelve', basicNamedWager('twelve'), (roll) => {
  return roll === 12 ? 310 : -10;
}));

test('any 7 bet', propBetTest('any7', basicNamedWager('any7'), (roll) => {
  return roll === 7 ? 50 : -10;
}));

test('any craps bet', propBetTest('anyCraps', basicNamedWager('anyCraps'), (roll) => {
  return [2, 3, 12].indexOf(roll) >= 0 ? 80 : -10;
}));

test('field bet', propBetTest('field', basicNamedWager('field'), (roll) => {
  let result = 0;

  if (roll === 2 || roll === 12) result = 30;
  else if (roll === 3 || roll === 4 || roll === 9 || roll === 10 || roll === 11) result = 20;
  else result = -10;

  return result;
}));

test('ability to request bets from the dealer', () => {
  const game = newGameStub([1, 1]);
  expect(Dealer.requestBet(game, game.wagers.player, 'pass', 1)).toBe(true);
  expect(game.wagers.player.pass).toBe(1);

  game.point = 4;
  expect(Dealer.requestBet(game, game.wagers.player, 'pass', 1)).toBe(false);
  expect(game.wagers.player.pass).toBe(1);
});