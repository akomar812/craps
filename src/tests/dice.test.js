'use strict';
const Dice = require('../dice.js');


test('dice constructor works as expected', () => {
  const dice = new Dice();
  expect(dice.current.length).toBe(0);
  expect(dice.value).toBe(0);
});


test('each dice roll has roughly a 1/6 probability of occurring', () => {
  /*
    strategy: roll the dice a ton of times and rely on the law of large numbers
    to eventually cause the occurrence of each possible dice roll to converge towards 1/6
  */
  const iterations = 300000;

  const rolls = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  };

  for (var i=0; i<iterations; i++) {
    rolls[Dice._getRoll()]++;
  }

  for (var key in rolls) {
    const distribution = (rolls[key] / iterations);
    const margin = Math.abs(distribution - (1/6));
    expect(margin).toBeLessThan(.01);
  }
});


test('basic dice roll', () => {
  const dice = new Dice();
  const iterations = 360000;

  const rolls = {
    2: [0, (1/36)],
    3: [0, (2/36)],
    4: [0, (3/36)],
    5: [0, (4/36)],
    6: [0, (5/36)],
    7: [0, (6/36)],
    8: [0, (5/36)],
    9: [0, (4/36)],
    10: [0, (3/36)],
    11: [0, (2/36)],
    12: [0, (1/36)]
  };

  for (var i=0; i<iterations; i++) {
    rolls[dice.roll().value][0]++;
  }

  for (var key in rolls) {
    const distribution = (rolls[key][0] / iterations);
    const margin = Math.abs(distribution - rolls[key][1]);
    expect(margin).toBeLessThan(.01);
  }
});

test('dice odds', () => {
  expect((new Dice()).odds()).toStrictEqual([
    'roll     chance             ways',
    '2        1 in 36 chance     1–1',
    '3        2 in 36 chance     1–2, 2–1',
    '4        3 in 36 chance     1–3, 2–2, 3–1',
    '5        4 in 36 chance     1–4, 2–3, 3–2, 4–1',
    '6        5 in 36 chance     1–5, 2–4, 3–3, 4–2, 5–1',
    '7        6 in 36 chance     1–6, 2–5, 3–4, 4–3, 5–2, 6–1',
    '8        5 in 36 chance     2–6, 3–5, 4–4, 5–3, 6–2',
    '9        4 in 36 chance     3–6, 4–5, 5–4, 6–3',
    '10       3 in 36 chance     4–6, 5–5, 6–4',
    '11       2 in 36 chance     5–6, 6–5',
    '12       1 in 36 chance     6–6'
  ]);
});
