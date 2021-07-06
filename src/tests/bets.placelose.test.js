'use strict';
const PlaceLose = require('../bets/placelose.js');
const utils = require('../utils.js');

test('placelose constructor works as expected', () => {
  const placeBetError = 'Place bets are only defined for 4, 5, 6, 8, 9, and 10';
  expect(() => new PlaceLose()).toThrow(new Error(placeBetError));

  for (let i=2; i<=12; i++) {
    if ([4, 5, 6, 8, 9, 10].indexOf(i) >= 0) {
      const p = new PlaceLose(i);
      expect(p.selection).toEqual(i);
    } else {
      expect(() => new PlaceLose(i)).toThrow(new Error(placeBetError));
    }
  }
});

test('placelose 4 bet evaluation behaves as expects', () => {
  const placelose4 = new PlaceLose(4);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose4.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 4));
    }
  }
});

test('placelose 5 bet evaluation behaves as expects', () => {
  const placelose5 = new PlaceLose(5);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose5.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 5));
    }
  }
});

test('placelose 6 bet evaluation behaves as expects', () => {
  const placelose6 = new PlaceLose(6);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose6.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 6));
    }
  }
});

test('placelose 8 bet evaluation behaves as expects', () => {
  const placelose8 = new PlaceLose(8);
  //expect(placelose4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose8.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 8));
    }
  }
});

test('placelose 9 bet evaluation behaves as expects', () => {
  const placelose9 = new PlaceLose(9);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose9.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 9));
    }
  }
});

test('placelose 10 bet evaluation behaves as expects', () => {
  const placelose10 = new PlaceLose(10);
  //expect(place4.houseEdge).toBe(9);

  for (let i=1; i<=6; i++) {
    for (let j=1; j<=6; j++) {
      expect(placelose10.evaluate({ dice: { value: i+j } })).toBe(utils.getTargetInverseExpectedValue(i+j, 10));
    }
  }
});