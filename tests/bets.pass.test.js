'use strict';
const Pass = require('../bets/pass.js');
const utils = require('./utils.js');

test('pass constructor works as expected', () => {
  const pass = new Pass();
  expect(pass.type).toBe('multi');
  expect(pass.houseEdge).toBe(1.41);
  expect(pass.payout).toStrictEqual({ '*': 1 });
});

test('pass bet evaluation behaves as expects', () => {
  const pass = new Pass();
  expect(pass.evaluate({ dice: { value: 2 } })).toBe(false);
  expect(pass.evaluate({ dice: { value: 3 } })).toBe(false);
  expect(pass.evaluate({ dice: { value: 4 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 5 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 6 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 7 } })).toBe(true);
  expect(pass.evaluate({ dice: { value: 8 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 9 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 10 } })).toBe(undefined);
  expect(pass.evaluate({ dice: { value: 11 } })).toBe(true);
  expect(pass.evaluate({ dice: { value: 12 } })).toBe(false);

  for (var i=0; i<100; i++) {
    const roll = utils.getRandomRoll();
    const point = utils.getRandomPoint();
    let expected;

    if (roll === point) expected = true;
    if (roll === 7) expected = false;

    expect(pass.evaluate({ point: point, dice: { value: roll } })).toBe(expected);
  }
});

test('pass bet only allows wagers when point is unset', () => {
  const pass = new Pass();
  expect(pass.isAllowingWagers({ point: null })).toBe(true);
  expect(pass.isAllowingWagers({ point: utils.getRandomPoint() })).toBe(false);
});
