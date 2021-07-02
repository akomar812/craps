'use strict';
const Horn = require('../bets/horn.js');

test('horn bet constructor works as expected', () => {
  const horn = new Horn();
  expect(horn.type).toBe('prop');
  expect(horn.houseEdge).toBe(12.78);
  expect(horn.payout).toStrictEqual({
    '2': (30/4),
    '3': (15/4),
    '11': (15/4),
    '12': (30/4)
  });

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(horn.evaluate({ dice: { value: i + j }})).toBe([2, 3, 11, 12].indexOf(i+j) >= 0);
    }
  }
});
