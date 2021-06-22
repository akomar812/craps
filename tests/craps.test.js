'use strict';
const Craps = require('../craps.js');
const Dice = require('../dice.js');
const Wagers = require('../wagers.js');

test('that craps constructor works as expected', () => {
  const craps = new Craps();
  expect(craps.debug).toBe(false);
  expect(craps.dice instanceof Dice).toBe(true);
  expect(craps.mode).toBe('single');
  expect(craps.payout).toBe(0);
  expect(craps.point).toBe(null);
  expect(craps.wagers.player instanceof Wagers).toBe(true);
});


// test('that each dice roll has roughly a 1/6 probability of occurring', () => {
//   /*
//     strategy: roll the dice a ton of times and rely on the law of large numbers
//     to eventually cause the occurrence of each possible dice roll to converge towards 1/6
//   */
//   const iterations = 300000;

//   const rolls = {
//     1: 0,
//     2: 0,
//     3: 0,
//     4: 0,
//     5: 0,
//     6: 0
//   };

//   for (var i=0; i<iterations; i++) {
//     rolls[Dice._getRoll()]++;
//   }

//   for (var key in rolls) {
//     const distribution = (rolls[key] / iterations);
//     const margin = Math.abs(distribution - (1/6));
//     expect(margin).toBeLessThan(.01);
//   }
// });


// test('basic dice roll', () => {
//   /*
//     2   1–1
//     3   1–2, 2–1
//     4   1–3, 2–2, 3–1
//     5   1–4, 2–3, 3–2, 4–1
//     6   1–5, 2–4, 3–3, 4–2, 5–1
//     7   1–6, 2–5, 3–4, 4–3, 5–2, 6–1
//     8   2–6, 3–5, 4–4, 5–3, 6–2
//     9   3–6, 4–5, 5–4, 6–3
//     10  4–6, 5–5, 6–4
//     11  5–6, 6–5
//     12  6–6 
//   */

//   const dice = new Dice();
//   const iterations = 360000;

//   const rolls = {
//     2: [0, (1/36)],
//     3: [0, (2/36)],
//     4: [0, (3/36)],
//     5: [0, (4/36)],
//     6: [0, (5/36)],
//     7: [0, (6/36)],
//     8: [0, (5/36)],
//     9: [0, (4/36)],
//     10: [0, (3/36)],
//     11: [0, (2/36)],
//     12: [0, (1/36)]
//   };

//   for (var i=0; i<iterations; i++) {
//     rolls[dice.roll().value][0]++;
//   }

//   for (var key in rolls) {
//     const distribution = (rolls[key][0] / iterations);
//     const margin = Math.abs(distribution - rolls[key][1]);
//     expect(margin).toBeLessThan(.01);
//   }
// });


// test('debug dice roll', () => {
//   const dice = new Dice({ debug: true });
//   const spy = jest.spyOn(console, 'log').mockImplementation();

//   dice.roll();
//   expect(spy).toHaveBeenCalledTimes(1);
//   expect(spy).toHaveBeenCalledWith('rolled:', dice.value);

//   spy.mockRestore();
// });
