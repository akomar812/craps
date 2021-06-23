'use strict';
const Wagers = require('../wagers.js');

test('wagers constructor works as expected', () => {
  const wagers = new Wagers();

  [
    'pass',
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
  const spy = jest.spyOn(console, 'log').mockImplementation();

  wagers.hard4 = 1;
  wagers.place9 = 2;
  wagers.three = 10;
  wagers.report();
  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy).toHaveBeenNthCalledWith(1, `three: ${10}`);
  expect(spy).toHaveBeenNthCalledWith(2, `place9: ${2}`);
  expect(spy).toHaveBeenNthCalledWith(3, `hard4: ${1}`);
  
  spy.mockRestore();
});