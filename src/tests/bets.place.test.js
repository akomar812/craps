'use strict';
const Place = require('../bets/place.js');
const utils = require('../utils.js');

test('place constructor works as expected', () => {
  const placeBetError = 'Place bets are only defined for 4, 5, 6, 8, 9, and 10';
  expect(() => new Place()).toThrow(new Error(placeBetError));

  for (let i=2; i<=12; i++) {
    if ([4, 5, 6, 8, 9, 10].indexOf(i) >= 0) {
      const p = new Place(i);
      expect(p.selection).toEqual(i);
    } else {
      expect(() => new Place(i)).toThrow(new Error(placeBetError));
    }
  }
});

test('place 4 bet evaluation behaves as expects', () => {
  const place4 = new Place(4);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place4.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 4));
    }
  }
});

test('place 5 bet evaluation behaves as expects', () => {
  const place5 = new Place(5);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place5.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 5));
    }
  }
});

test('place 6 bet evaluation behaves as expects', () => {
  const place6 = new Place(6);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place6.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 6));
    }
  }
});

test('place 8 bet evaluation behaves as expects', () => {
  const place8 = new Place(8);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place8.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 8));
    }
  }
});

test('place 9 bet evaluation behaves as expects', () => {
  const place4 = new Place(9);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place4.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 9));
    }
  }
});

test('place 10 bet evaluation behaves as expects', () => {
  const place10 = new Place(10);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(place10.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetExpectedValue(i+j, 10));
    }
  }
});