'use strict';
const Craps = require('../craps.js');
const Dice = require('../dice.js');
const Wagers = require('../wagers.js');

test('craps constructor works as expected', () => {
  const craps = new Craps();
  expect(craps.debug).toBe(false);
  expect(craps.dice instanceof Dice).toBe(true);
  expect(craps.mode).toBe('single');
  expect(craps.point).toBe(null);
});

test('players can be added and not duplicated', () => {
  const craps = new Craps();
  craps.addPlayer('player');
  expect(craps.players.player.wagers instanceof Wagers).toBe(true);
  expect(() => craps.addPlayer('player')).toThrow(new Error('A player named player already exists'));
});

test('craps games can be restarted', () => {
  const craps = new Craps();
  craps.addPlayer('player');
  craps.point = 8;
  craps.players.player.wagers.big6 = 50;
  craps.players.player.wagers.any7 = 1000;
  craps.newGame();
  expect(craps.point).toBe(null);
  expect(craps.players.player.wagers.big6).toBe(0);
  expect(craps.players.player.wagers.any7).toBe(0);
});
