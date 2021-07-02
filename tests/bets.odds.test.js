'use strict';
const Odds = require('../bets/odds.js');
const utils = require('./utils.js');

test('odds bet constructor works as expected', () => {
  const odds = new Odds();
  expect(odds.type).toBe('multi');
  expect(odds.houseEdge).toBe(0);
  expect(odds.payout).toStrictEqual({
    '4': 2,
    '5': (3/2),
    '6': (6/5),
    '8': (6/5),
    '9': (3/2),
    '10': 2
  });

  const craps = { dice: { value: 7 } };
  expect(odds.evaluate(craps)).toBe(false);

  const craps1 = { dice: { value: 4 }, point: 4 };
  expect(odds.evaluate(craps1)).toBe(true);

  const craps2 = { dice: { value: 5 }, point: 9 };
  expect(odds.evaluate(craps2)).toBe(undefined);

  const craps3 = { point: null };
  expect(odds.isAllowingWagers(craps3)).toBe(false);

  const craps4 = { point: true };
  expect(odds.isAllowingWagers(craps4)).toBe(true);
});
