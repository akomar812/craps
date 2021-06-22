'use strict';
const AnyCraps = require('../bets/anycraps.js');
const utils = require('./utils.js');

test('any craps constructor works as expected', () => {
  const anyCraps = new AnyCraps();
  expect(anyCraps.type).toBe('prop');
  expect(anyCraps.houseEdge).toBe(11.11);
  expect(anyCraps.payout).toStrictEqual({ '*': 7 });
});

test('any craps bet evaluation behaves as expects', () => {
  const anyCraps = new AnyCraps();

  for (var i=0; i<10; i++) {
    const roll = utils.getRandomRoll();
    const expected = roll === 2 || roll === 3 || roll === 12 ? true : false;
    expect(anyCraps.evaluate({ dice: { value: roll } })).toBe(expected);
  }
});
