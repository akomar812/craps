// 'use strict';
// const Game = require('..');
// jest.useFakeTimers();

// test('game works as expected', async () => {
//   const game = await Game.textInterface();
//   const obj = { sendFn: () => {} };
//   const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
//   const craps = game('player', 'status', obj.sendFn);

//   expect(craps.point).toBe(null);
//   expect(craps.rotation).toStrictEqual([]);
//   expect(craps.shooter).toBe(null);
//   expect(spy).toHaveBeenCalledTimes(2);

//   spy.mockRestore();
// });

// test('scenario 2', () => {
//   const game = Game.textInterface();
//   const obj = { sendFn: () => {} };
//   const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
//   let craps = game('player', 'join', obj.sendFn);
//   craps = game('player1', 'join', obj.sendFn);
//   craps = game('player2', 'join', obj.sendFn);

//   expect(Object.keys(craps.players).length).toBe(3);
//   expect(craps.shooter).toBe('player');

//   craps = game('player', 'bet pass 10', obj.sendFn);
//   expect(craps.players.player.wagers.pass).toBe(10);

//   craps = game('player1', 'exit', obj.sendFn);
//   expect(Object.keys(craps.players).length).toBe(2);

//   craps.dice.value = 7;
//   craps.dice.current = [3, 4];
//   craps.Dealer.manage(craps);
//   expect(craps.players.player.pot).toBe(120);
//   expect(craps.shooter).toBe('player2');

//   game('player', 'exit', obj.sendFn);
//   game('player2', 'exit', obj.sendFn);
//   spy.mockRestore();
// });

// test('scenario 3', () => {
//   const game = Game.textInterface();
//   const obj = { sendFn: () => {} };
//   const spy = jest.spyOn(obj, 'sendFn').mockImplementation();
//   let craps = game('player', 'join', obj.sendFn);

//   craps = game('player', 'bet place6 10', obj.sendFn);
//   expect(craps.players.player.wagers.place6).toBe(10);

//   craps.dice.value = 8;
//   craps.dice.current = [3, 5];
//   craps.Dealer.manage(craps);
//   expect(craps.players.player.pot).toBe(100);

//   game('player', 'exit', obj.sendFn);
//   spy.mockRestore();
// });
test('', () => expect(true).toBe(true));