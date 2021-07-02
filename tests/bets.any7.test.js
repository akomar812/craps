'use strict';
const Any7 = require('../bets/any7.js');
const utils = require('../utils.js');

test('any 7 constructor works as expected', () => {
  const any7 = new Any7();
  expect(any7.type).toBe('prop');
  expect(any7.houseEdge).toBe(16.67);
  expect(any7.payout).toStrictEqual({ '*': 4 });
});

test('any 7 bet evaluation behaves as expects', () => {
  const any7 = new Any7();

  for (var i=0; i<10; i++) {
    const roll = utils.getRandomRoll().value;
    const expected = roll === 7 ? true : false;
    expect(any7.evaluate({ dice: { value: roll }})).toBe(expected);
  }
});
