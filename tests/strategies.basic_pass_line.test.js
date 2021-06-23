'use strict';
const Strategy = require('../strategies/basic_pass_line.js');
//const Craps = require('../craps.js');

test('basic pass line strategy constructor', () => {
  const strategy = new Strategy({ amount: 11 });
  expect(strategy.debug).toBe(false);
  expect(strategy.amount).toBe(11);

  const strategy1 = new Strategy({ debug: true });
  expect(strategy1.debug).toBe(true);
  expect(strategy1.amount).toBe(10);
});


// test('pre-roll behavior for basic pass line strategy', () => {
//   const spy = jest.spyOn(console, 'log').mockImplementation();
//   const strategy = new Strategy();

//   const game = new Craps();
//   game.addPlayer('player');
//   strategy.beforeRoll(game);
//   expect(game.players.player.wagers.pass).toBe(10);

//   const game1 = new Craps();
//   game1.point = 6;
//   game1.addPlayer('player');
//   strategy.beforeRoll(game1);
//   expect(game1.players.player.wagers.pass).toBe(0);

//   const game2 = new Craps();
//   game2.addPlayer('player');
//   strategy.beforeRoll(game2);
//   expect(game2.players.player.wagers.pass).toBe(10);

//   const game3 = new Craps();
//   game3.point = 6;
//   game3.addPlayer('player');
//   strategy.beforeRoll(game3);
//   expect(game3.players.player.wagers.pass).toBe(10);

//   expect(spy).toHaveBeenCalledTimes(1);
//   expect(spy).toHaveBeenCalledWith('Placing pass line wager:', strategy.amount, 'current payout:', game3.players.player.pot);
//   spy.mockRestore();
// });
