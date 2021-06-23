'use strict';
const Field = require('../bets/field.js');

test('field bet constructor works as expected', () => {
  const field = new Field();
  expect(field.houseEdge).toBe(5.5);
});

test('field bet evaluation behaves as expects', () => {
  const field = new Field();

  for (let i=2; i<=12; i++) {
    expect(field.evaluate({ dice: { value: i } })).toBe([2, 3, 4, 9, 10, 11, 12].indexOf(i) >= 0);
  }
});
