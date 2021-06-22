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
  expect(pass.evaluate(2)).toBe(false);
  expect(pass.evaluate(3)).toBe(false);
  expect(pass.evaluate(4)).toBe(undefined);
  expect(pass.evaluate(5)).toBe(undefined);
  expect(pass.evaluate(6)).toBe(undefined);
  expect(pass.evaluate(7)).toBe(true);
  expect(pass.evaluate(8)).toBe(undefined);
  expect(pass.evaluate(9)).toBe(undefined);
  expect(pass.evaluate(10)).toBe(undefined);
  expect(pass.evaluate(11)).toBe(true);
  expect(pass.evaluate(12)).toBe(false);

  for (var i=0; i<100; i++) {
    const roll = utils.getRandomRoll();
    const point = utils.getRandomPoint();
    let expected;

    if (roll === point) expected = true;
    if (roll === 7) expected = false;

    expect(pass.evaluate(roll, point)).toBe(expected);
  }
});
