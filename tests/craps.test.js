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

test('craps games can be restarted', () => {
  const craps = new Craps();
  craps.addPlayer('player');
  craps.payout = 100;
  craps.point = 8;
  craps.wagers.player.big6 = 50;
  craps.wagers.player.any7 = 1000;
  craps.newGame();
  expect(craps.payout).toBe(0);
  expect(craps.point).toBe(null);
  expect(craps.wagers.player.big6).toBe(0);
  expect(craps.wagers.player.any7).toBe(0);
});
