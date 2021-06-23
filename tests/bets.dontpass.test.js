'use strict';
const DontPass = require('../bets/dontpass.js');
const utils = require('./utils.js');

test('don\'t pass constructor works as expected', () => {
  const dontpass = new DontPass();
  expect(dontpass.type).toBe('multi');
  expect(dontpass.houseEdge).toBe(1.36);
  expect(dontpass.payout).toStrictEqual({ '2': 1, '3': 1, '12': 0, '*': 1 });
});

test('don\'t pass bet evaluation behaves as expects', () => {
  const dontpass = new DontPass();
  expect(dontpass.evaluate({ dice: { value: 2 } })).toBe(true);
  expect(dontpass.evaluate({ dice: { value: 3 } })).toBe(true);
  expect(dontpass.evaluate({ dice: { value: 4 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 5 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 6 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 7 } })).toBe(false);
  expect(dontpass.evaluate({ dice: { value: 8 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 9 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 10 } })).toBe(undefined);
  expect(dontpass.evaluate({ dice: { value: 11 } })).toBe(false);
  expect(dontpass.evaluate({ dice: { value: 12 } })).toBe(true);

  for (var i=0; i<100; i++) {
    const roll = utils.getRandomRoll();
    const point = utils.getRandomPoint();
    let expected;

    if (roll === point) expected = false;
    if (roll === 7) expected = true;

    expect(dontpass.evaluate({ point: point, dice: { value: roll } })).toBe(expected);
  }
});

test('don\'t pass bet only allows wagers when point is unset', () => {
  const dontpass = new DontPass();
  expect(dontpass.isAllowingWagers({ point: null })).toBe(true);
  expect(dontpass.isAllowingWagers({ point: utils.getRandomPoint() })).toBe(false);
});
