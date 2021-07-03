'use strict';
const Game = require('..');
jest.useFakeTimers();

test('game works as expected', async () => {
  const game = await Game();
  const obj = { sendFn: () => {} };
  const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
  const craps = await game('player', 'status', obj.sendFn);

  expect(craps.point).toBe(null);
  expect(craps.rotation).toStrictEqual([]);
  expect(craps.shooter).toBe(null);
  expect(spy).toHaveBeenCalledTimes(2);

  spy.mockRestore();
});

test('scenario 2', async () => {
  const game = await Game();
  const obj = { sendFn: () => {} };
  const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
  let craps;

  craps = await game('player', 'join', obj.sendFn);
  craps = await game('player1', 'join', obj.sendFn);
  craps = await game('player2', 'join', obj.sendFn);

  craps = await game('player', 'bank withdraw 100', obj.sendFn);
  craps = await game('player1', 'bank withdraw 100', obj.sendFn);
  craps = await game('player2', 'bank withdraw 100', obj.sendFn);

  expect(Object.keys(craps.players).length).toBe(3);
  expect(craps.shooter).toBe('player');

  craps = await game('player', 'bet pass 10', obj.sendFn);
  expect(craps.players.player.wagers.pass).toBe(10);

  craps = await game('player1', 'exit', obj.sendFn);
  expect(Object.keys(craps.players).length).toBe(2);

  craps.dice.value = 7;
  craps.dice.current = [3, 4];
  craps.Dealer.manage(craps);
  expect(craps.players.player.pot).toBe(110);
  expect(craps.shooter).toBe('player2');

  await game('player', 'exit', obj.sendFn);
  await game('player2', 'exit', obj.sendFn);
  spy.mockRestore();
});

test('scenario 3', async () => {
  const game = await Game();
  const obj = { sendFn: () => {} };
  const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
  let craps;
  
  craps = await game('player', 'join', obj.sendFn);
  craps = await game('player', 'bank withdraw 100', obj.sendFn);
  craps = await game('player', 'bet place6 10', obj.sendFn);
  expect(craps.players.player.wagers.place6).toBe(10);

  craps.dice.value = 8;
  craps.dice.current = [3, 5];
  craps.Dealer.manage(craps);
  expect(craps.players.player.pot).toBe(100);

  await game('player', 'exit', obj.sendFn);
  spy.mockRestore();
});

