'use strict';
const Bet = require('../bets').Bet;


test('bet constructor works as expected', () => {
  expect(() => new Bet())
    .toThrow(new Error('Invalid bet type: undefined'));

  const invalidBetType = 'aowihaoiawr';
  expect(() => new Bet({ type: invalidBetType }))
    .toThrowError(new Error('Invalid bet type: '+invalidBetType));

  expect(() => new Bet({ type: 'prop', houseEdge: 0 }))
    .toThrowError(new Error('House edge must be in range (0 and 100)'));

  expect(() => new Bet({ type: 'prop', houseEdge: 100 }))
    .toThrowError(new Error('House edge must be in range (0 and 100)'));


  const bet = new Bet({ type: 'multi', houseEdge: .0001 });
  expect(bet.type).toBe('multi');
  expect(bet.houseEdge).toBe(.0001);
  expect(bet.isAllowingWagers()).toBe(true);

  const spy = jest.spyOn(console, 'warn').mockImplementation();
  bet.evaluate();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith('Bet evaluate method is meant to be overridden by a class which implements this interface');
  spy.mockRestore();
});
