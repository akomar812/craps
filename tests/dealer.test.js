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
    wagers: Object.assign({
      ...new Wagers(),
      ...wagers
    })
  };
};

const basicPassWager = () => {
  return { pass: 10 };
};

const basicComeWager = () => {
  return { come: { pass: 10, point: null } };
};

const basicPlaceWager = (n) => {
  const bets = [4, 5, 6, 8, 9, 10];
  const wagers = {};

  for (let i=0; i<bets.length; i++) {
    wagers[bets[i]] = bets[i] === n ? 10 : 0;
  }

  return { place: wagers };
};

const basicBigWager = (n) => {
  const wager = { big: { '6': 0, '8': 0 } };
  wager.big[n] = 10;
  return wager;
};

const basicHardWager = (n) => {
  const wager = { hard: { '4': 0, '6': 0, '8': 0, '10': 0 } };
  wager.hard[n] = 10;
  return wager;
};

const basicNamedWager = (name) => {
  return { [name]: 10 };
};

const propBetTest = (wagerConfig, payoutFn) => {
  return () => {
    for (let i=1; i<=6; i++) {
      for (let j=1; j<=6; j++) {
        const game = newGameStub([i, j], utils.getRandomPoint(), wagerConfig);
        Dealer.manage(game);
        expect(game.payout).toBe(payoutFn(i+j));
        expect(game.wagers.anyCraps).toBe(0);
      }
    }
  };
};

test('win payout', () => {
  const game = newGameStub([0, 0], null, basicPassWager());
  Dealer.payoutWin(game, game.wagers, pass, 'pass');
  expect(game.payout).toBe(20);
  expect(game.wagers.pass).toBe(0);
});

test('loss payout', () => {
  const game = newGameStub([0, 0], null, basicPassWager());
  Dealer.payoutLoss(game, game.wagers, 'pass');
  expect(game.payout).toBe(-10);
  expect(game.wagers.pass).toBe(0);
});

test('pass bet win when point is off', () => {
  const game = newGameStub([3, 4], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.pass).toBe(0);
});

test('pass bet lose when point is off', () => {
  const game = newGameStub([1, 1], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.pass).toBe(0);
});

test('pass bet open when point is off', () => {
  const game = newGameStub([2, 3], null, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(5);
  expect(game.wagers.pass).toBe(10);
});

test('pass bet win when point is on', () => {
  const game = newGameStub([3, 3], 6, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.pass).toBe(0);
});

test('pass bet lose when point is on', () => {
  const game = newGameStub([6, 1], 10, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(null);
  expect(game.wagers.pass).toBe(0);
});

test('pass bet no op when point is off', () => {
  const game = newGameStub([6, 4], 4, basicPassWager());
  Dealer.manage(game);
  expect(game.payout).toBe(0);
  expect(game.point).toBe(4);
  expect(game.wagers.pass).toBe(10);
});

test('come bet win', () => {
  const game = newGameStub([5, 2], 5, basicComeWager());
  Dealer.manage(game);
  expect(game.payout).toBe(20);
  expect(game.point).toBe(null);
  expect(game.wagers.come.pass).toBe(0);
  expect(game.wagers.come.point).toBe(null);
});

test('come bet lose', () => {
  const game = newGameStub([2, 1], 8, basicComeWager());
  Dealer.manage(game);
  expect(game.payout).toBe(-10);
  expect(game.point).toBe(8);
  expect(game.wagers.come.pass).toBe(0);
  expect(game.wagers.come.point).toBe(null);
});

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

test('place 4 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(4));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 4) {
        expectedPayout = 10 + (10 * (9/5));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['4']).toBe(expectedWager);
    }
  }
});

test('place 5 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(5));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 5) {
        expectedPayout = 10 + (10 * (7/5));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['5']).toBe(expectedWager);
    }
  }
});

test('place 6 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(6));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 6) {
        expectedPayout = 10 + (10 * (7/6));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['6']).toBe(expectedWager);
    }
  }
});

test('place 8 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(8));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 8) {
        expectedPayout = 10 + (10 * (7/6));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['8']).toBe(expectedWager);
    }
  }
});

test('place 9 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(9));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 9) {
        expectedPayout = 10 + (10 * (7/5));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['9']).toBe(expectedWager);
    }
  }
});

test('place 10 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicPlaceWager(10));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 10) {
        expectedPayout = 10 + (10 * (9/5));
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.place['10']).toBe(expectedWager);
    }
  }
});

test('big 6 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicBigWager(6));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 6) {
        expectedPayout = 20;
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.big['6']).toBe(expectedWager);
    }
  }
});

test('big 8 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicBigWager(8));
      Dealer.manage(game);

      let expectedPayout = 0;
      let expectedWager = 10;

      if (i + j === 8) {
        expectedPayout = 20;
        expectedWager = 0;
      } else if (i + j === 7) {
        expectedPayout = -10;
        expectedWager = 0;
      }

      expect(game.payout).toBe(expectedPayout);
      expect(game.wagers.big['8']).toBe(expectedWager);
    }
  }
});

test('hard 4 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicHardWager(4));
      Dealer.manage(game);

      const ex = utils.getHardWayExpectedValue(i, j, 4);
      let expected;

      if (ex === true) {
        expected = 80;
      } else if (ex === false) {
        expected = -10;
      } else {
        expected = 0;
      }

      expect(game.payout).toBe(expected);
      expect(game.wagers.hard['4']).toBe(expected === 0 ? 10 : 0);
    }
  }
});

test('hard 6 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicHardWager(6));
      Dealer.manage(game);

      const ex = utils.getHardWayExpectedValue(i, j, 6);
      let expected;

      if (ex === true) {
        expected = 100;
      } else if (ex === false) {
        expected = -10;
      } else {
        expected = 0;
      }

      expect(game.payout).toBe(expected);
      expect(game.wagers.hard['6']).toBe(expected === 0 ? 10 : 0);
    }
  }
});

test('hard 8 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicHardWager(8));
      Dealer.manage(game);

      const ex = utils.getHardWayExpectedValue(i, j, 8);
      let expected;

      if (ex === true) {
        expected = 100;
      } else if (ex === false) {
        expected = -10;
      } else {
        expected = 0;
      }

      expect(game.payout).toBe(expected);
      expect(game.wagers.hard['8']).toBe(expected === 0 ? 10 : 0);
    }
  }
});

test('hard 10 bet', () => {
  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      const game = newGameStub([i, j], 9, basicHardWager(10));
      Dealer.manage(game);

      const ex = utils.getHardWayExpectedValue(i, j, 10);
      let expected;

      if (ex === true) {
        expected = 80;
      } else if (ex === false) {
        expected = -10;
      } else {
        expected = 0;
      }

      expect(game.payout).toBe(expected);
      expect(game.wagers.hard['10']).toBe(expected === 0 ? 10 : 0);
    }
  }
});

test('2 bet', propBetTest(basicNamedWager('two'), (roll) => {
  return roll === 2 ? 310 : -10;
}));

test('3 bet', propBetTest(basicNamedWager('three'), (roll) => {
  return roll === 3 ? 160 : -10;
}));

test('11 bet', propBetTest(basicNamedWager('eleven'), (roll) => {
  return roll === 11 ? 160 : -10;
}));

test('12 bet', propBetTest(basicNamedWager('twelve'), (roll) => {
  return roll === 12 ? 310 : -10;
}));

test('any 7 bet', propBetTest(basicNamedWager('any7'), (roll) => {
  return roll === 7 ? 50 : -10;
}));

test('any craps bet', propBetTest(basicNamedWager('anyCraps'), (roll) => {
  return [2, 3, 12].indexOf(roll) >= 0 ? 80 : -10;
}));
