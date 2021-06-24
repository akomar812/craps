'use strict';
const Wagers = require('../wagers.js');

test('wagers constructor works as expected', () => {
  const wagers = new Wagers();

  [
    'pass',
    'dontpass',
    'two',
    'three',
    'eleven',
    'twelve',
    'any7',
    'anyCraps',
    'field'
  ].map(w => expect(wagers[w]).toBe(0));

  [
    '4',
    '5',
    '6',
    '8',
    '9',
    '10'
  ].map(w => expect(wagers['place'+w]).toBe(0));

  [
    '6',
    '8'
  ].map(w => expect(wagers['big'+w]).toBe(0));

  [
    '4',
    '6',
    '8',
    '10'
  ].map(w => expect(wagers['hard'+w]).toBe(0));
});

test('bets cause wager book to activate', () => {
  const wagers = new Wagers();

  for (let bet in wagers) {
    const w = new Wagers();
    expect(w.isActive()).toBe(false);
    w[bet] = 10;
    expect(w.isActive()).toBe(true);
  }
});

test('bets cause wager book to activate', () => {
  const wagers = new Wagers();
  let expectedTotal = 0;

  for (let bet in wagers) {
    if (Math.floor(2*Math.random()) === 1) {
      const amt = Math.floor(100 * Math.random());
      expectedTotal += amt;
      wagers[bet] += amt;
    }
  }

  expect(wagers.total()).toBe(expectedTotal);
});
