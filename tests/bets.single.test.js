'use strict';
const Single = require('../bets/single.js');

test('single bet constructor works as expected', () => {
  expect(() => new Single()).toThrow(new Error('Single bets are only defined for 2, 3, 11, and 12'));

  for (let i=2; i<=12; i++) {
    if (i===2 || i===3 || i===11 || i===12) {
      const s = new Single(i);
      expect(s.selection).toEqual(i);
    } else {
      expect(() => new Single(i)).toThrow(new Error('Single bets are only defined for 2, 3, 11, and 12'));
    }
  }
});

test('two bet evaluation behaves as expects', () => {
  const two = new Single(2);
  expect(two.houseEdge).toBe(13.89);

  for (let i=2; i<=12; i++) {
    expect(two.evaluate({ dice: { value: i } })).toBe(i === 2);
  }
});

test('three bet evaluation behaves as expects', () => {
  const three = new Single(3);
  expect(three.houseEdge).toBe(11.11);

  for (let i=2; i<=12; i++) {
    expect(three.evaluate({ dice: { value: i } })).toBe(i === 3);
  }
});

test('eleven bet evaluation behaves as expects', () => {
  const eleven = new Single(11);
  expect(eleven.houseEdge).toBe(11.11);

  for (let i=2; i<=12; i++) {
    expect(eleven.evaluate({ dice: { value: i } })).toBe(i === 11);
  }
});

test('twelve bet evaluation behaves as expects', () => {
  const twelve = new Single(12);
  expect(twelve.houseEdge).toBe(13.89);

  for (let i=2; i<=12; i++) {
    expect(twelve.evaluate({ dice: { value: i } })).toBe(i === 12);
  }
});