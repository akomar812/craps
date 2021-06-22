'use strict';
const Strategy = require('../strategies/basic_pass_line.js');

test('basic pass line strategy constructor', () => {
  const strategy = new Strategy({ amount: 11 });
  expect(strategy.debug).toBe(false);
  expect(strategy.amount).toBe(11);

  const strategy1 = new Strategy({ debug: true });
  expect(strategy1.debug).toBe(true);
  expect(strategy1.amount).toBe(10);
});


test('pre-roll behavior for basic pass line strategy', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation();
  const strategy = new Strategy();

  const game = {
    on: null,
    payout: 10,
    wagers: {
      pass: 0
    }
  };
  strategy.beforeRoll(game);
  expect(game.wagers.pass).toBe(10);

  const game1 = {
    on: 6,
    payout: 10,
    wagers: {
      pass: 0
    }
  };
  strategy.beforeRoll(game1);
  expect(game1.wagers.pass).toBe(0);

  const game2 = {
    on: null,
    payout: 10,
    wagers: {
      pass: 10
    }
  };
  strategy.beforeRoll(game2);
  expect(game2.wagers.pass).toBe(10);

  const game3 = {
    on: 6,
    payout: 10,
    wagers: {
      pass: 10
    }
  };
  strategy.beforeRoll(game3);
  expect(game3.wagers.pass).toBe(10);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('Placing pass line wager:', strategy.amount, 'current payout:', game.payout);
  spy.mockRestore();
});
