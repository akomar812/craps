'use strict';
const Craps = require('../craps.js');
const Dice = require('../dice.js');
const Wagers = require('../wagers.js');

test('craps constructor works as expected', () => {
  const craps = new Craps();
  expect(craps.debug).toBe(false);
  expect(craps.dice instanceof Dice).toBe(true);
  expect(craps.mode).toBe('single');
  expect(craps.payout).toBe(0);
  expect(craps.point).toBe(null);
});

test('players can be added and not duplicated', () => {
  const craps = new Craps();

  craps.addPlayer('player');
  expect(craps.wagers.player instanceof Wagers).toBe(true);
  expect(() => craps.addPlayer('player')).toThrow(new Error('A player named player already exists'));
});
