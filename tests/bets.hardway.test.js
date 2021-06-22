'use strict';
const HardWay = require('../bets/hardway.js');
const utils = require('./utils.js');

test('that hard way bet constructor works as expected', () => {
  expect(() => new HardWay()).toThrow(new Error('Hard way bets are only defined for 4, 6, 8, and 10'));

  for (let i=2; i<=12; i++) {
    if (i===4 || i===6 || i===8 || i===10) {
      const h = new HardWay(i);
      expect(h.selection).toEqual(i);
    } else {
      expect(() => new HardWay(i)).toThrow(new Error('Hard way bets are only defined for 4, 6, 8, and 10'));
    }
  }
});

test('that hard 4 bet evaluation behaves as expects', () => {
  const hard4 = new HardWay(4);
  expect(hard4.houseEdge).toBe(11.11);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(hard4.evaluate([i, j])).toBe(utils.getHardWayExpectedValue(i, j, 4)); 
    }
  }
});

test('that hard 6 bet evaluation behaves as expects', () => {
  const hard6 = new HardWay(6);
  expect(hard6.houseEdge).toBe(9.09);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(hard6.evaluate([i, j])).toBe(utils.getHardWayExpectedValue(i, j, 6)); 
    }
  }
});

test('that hard 8 bet evaluation behaves as expects', () => {
  const hard8 = new HardWay(8);
  expect(hard8.houseEdge).toBe(9.09);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(hard8.evaluate([i, j])).toBe(utils.getHardWayExpectedValue(i, j, 8)); 
    }
  }
});

test('that hard 10 bet evaluation behaves as expects', () => {
  const hard10 = new HardWay(10);
  expect(hard10.houseEdge).toBe(11.11);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(hard10.evaluate([i, j])).toBe(utils.getHardWayExpectedValue(i, j, 10)); 
    }
  }
});