'use strict';
const Big = require('../bets/big.js');
const utils = require('./utils.js');

test('big bet constructor works as expected', () => {
  expect(() => new Big()).toThrow(new Error('Big bets are only defined for 6, and 8'));

  for (let i=2; i<=12; i++) {
    if (i===6 || i===8) {
      const b = new Big(i);
      expect(b.selection).toEqual(i);
    } else {
      expect(() => new Big(i)).toThrow(new Error('Big bets are only defined for 6, and 8'));
    }
  }
});

test('big 6 bet evaluation behaves as expects', () => {
  const big6 = new Big(6);
  expect(big6.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(big6.evaluate([i, j])).toBe(utils.getBigBetExpectedValue(i, j, 6));
    }
  }
});

test('big 8 bet evaluation behaves as expects', () => {
  const big8 = new Big(8);
  expect(big8.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(big8.evaluate([i, j])).toBe(utils.getBigBetExpectedValue(i, j, 8));
    }
  }
});
