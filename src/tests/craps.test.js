'use strict';
jest.mock('fs');
const Craps = require('../craps.js');
const Dice = require('../dice.js');
const Wagers = require('../wagers.js');
jest.useFakeTimers();

test('craps constructor works as expected', () => {
  const craps = new Craps({ Models: { Account: {} } });
  expect(craps.dice instanceof Dice).toBe(true);
  expect(craps.mode).toBe('single');
  expect(craps.point).toBe(null);
  expect(craps.shooter).toBe(null);
});

test('craps initializer works as expected for single player', () => {
  const craps = new Craps({ Models: { Account: {} } });
  const bankSpy = jest.spyOn(craps.bank, 'init').mockImplementation(() => Promise.resolve());
  const joinSpy = jest.spyOn(craps.Dealer, 'requestPlayerJoin').mockImplementation((game, player) => game.shooter = player);

  return craps.init().then(() => {
    expect(bankSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(craps, 'player');
    expect(craps.shooter).toBe('player');
    jest.restoreAllMocks();
  });
});

test('craps initializer works as expected for multi-player', () => {
  const craps = new Craps({ Models: { Account: {} }, mode: 'multi' });
  const bankSpy = jest.spyOn(craps.bank, 'init').mockImplementation(() => Promise.resolve());
  const joinSpy = jest.spyOn(craps.Dealer, 'requestPlayerJoin').mockImplementation();

  return craps.init().then(() => {
    expect(bankSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledTimes(0);
    jest.restoreAllMocks();
  });
});

test('players can be added and not duplicated', () => {
  const craps = new Craps({ Models: { Account: {} } });
  craps.addPlayer('player1');
  expect(craps.players.player1.wagers instanceof Wagers).toBe(true);
  expect(() => craps.addPlayer('player1')).toThrow(new Error('A player named player1 already exists'));
});

test('craps games can be restarted', () => {
  // when single player
  const craps = new Craps({ Models: { Account: {} } });
  craps.point = 8;
  craps.players.player = { wagers: { big6: 50, any7: 1000 } };
  craps.newGame();
  expect(craps.point).toBe(null);
  expect(craps.players.player.wagers.big6).toBe(0);
  expect(craps.players.player.wagers.any7).toBe(0);

  // when multi-player
  const craps1 = new Craps({ Models: { Account: {} }, mode: 'multi' });
  craps1.players = { player: {}, player1: {} };
  craps1.rotation = ['player', 'player1'];
  craps1.shooter = 'player';
  craps1.newGame();
  expect(craps1.shooter).toBe('player1');
});
