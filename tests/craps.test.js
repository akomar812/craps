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
  expect(craps.shooter).toBe('player');
});

test('players can be added and not duplicated', () => {
  const craps = new Craps();
  craps.addPlayer('player1');
  expect(craps.players.player1.wagers instanceof Wagers).toBe(true);
  expect(() => craps.addPlayer('player1')).toThrow(new Error('A player named player1 already exists'));
});

test('craps games can be restarted', () => {
  const craps = new Craps();
  craps.point = 8;
  craps.players.player.wagers.big6 = 50;
  craps.players.player.wagers.any7 = 1000;
  craps.newGame();
  expect(craps.point).toBe(null);
  expect(craps.players.player.wagers.big6).toBe(0);
  expect(craps.players.player.wagers.any7).toBe(0);
});
