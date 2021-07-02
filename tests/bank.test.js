'use strict';
const Bank = require('../bank.js');
const NothingToWithdrawError = (p) => `Player ${p} has nothing to withdraw`;

test('bank constructor works as expected', () => {
  // when Account Model is missing
  expect(() => new Bank()).toThrow('Bank constructor requires Account Model argument');

  // when constructor is properly called
  const bank = new Bank({ Models: { Account: {} } });
  expect(bank.Account).toStrictEqual({});
  expect(bank.deposits).toStrictEqual({});
});

test('bank initializer works as expected', () => {
  const opts = { Models: { Account: { findAll: () => {} } } };
  const spy = jest.spyOn(opts.Models.Account, 'findAll').mockImplementation(() => new Promise(resolve => resolve([{name: 'test1', balance: 123, high: 234}, {name: 'test2', balance: 345, high: 456}])));

  const bank = new Bank(opts);
  return bank.init(() => {
    expect(spy).toHaveBeenCalledTimes(1);
    expect(bank.deposits).toStrictEqual({ test1: { balance: 123, high: 234 }, test2: { balance: 345, high: 456 } });
  });
});

test('bank deposit', () => {
  const opts = { Models: { Account: { findAll: () => {}, create: () => {} } } };
  const findSpy = jest.spyOn(opts.Models.Account, 'findAll').mockImplementation(() => new Promise(resolve => resolve([{name: 'test1', balance: 123, high: 234}, {name: 'test2', balance: 345, high: 456}])));
  const createSpy = jest.spyOn(opts.Models.Account, 'create').mockImplementation((opts) => new Promise(resolve => resolve({...opts, deposit: () => {}})));
  let depositSpy;

  const bank = new Bank(opts);
  return bank.handleDeposit('player', 10).then(() => {
    expect(findSpy).toHaveBeenCalledTimes(0); // bank is usable without calling init
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(bank.deposits.player.balance).toBe(10);
    expect(bank.deposits.player.high).toBe(10);

    depositSpy = jest.spyOn(bank.deposits.player, 'deposit').mockImplementation();
    return bank.handleDeposit('player', 11);
  }).then(() => {
    expect(depositSpy).toHaveBeenCalledTimes(1);
    expect(depositSpy).toHaveBeenCalledWith(11);
  });
});

test('bank withdrawal', () => {
  const opts = { Models: { Account: { findAll: () => {} } } };
  const bank = new Bank(opts);

  expect(() => bank.handleWithdrawal('player', 50)).rejects.toThrow(NothingToWithdrawError('player'));

  const findSpy = jest.spyOn(opts.Models.Account, 'findAll').mockImplementation(() => new Promise(resolve => resolve([{name: 'player', balance: 123, high: 234, withdraw: () => {}}])));
  let withdrawSpy;

  bank.init().then(() => {
    expect(findSpy).toHaveBeenCalledTimes(1);
    withdrawSpy = jest.spyOn(bank.deposits.player, 'withdraw').mockImplementation();
    return bank.handleWithdrawal('player', 25);
  }).then(() => {
    expect(withdrawSpy).toHaveBeenCalledTimes(1);
    expect(withdrawSpy).toHaveBeenCalledWith(25);
  });
});

test('bank status report', () => {
  const opts = { Models: { Account: { findAll: () => {} } } };
  const findSpy = jest.spyOn(opts.Models.Account, 'findAll').mockImplementation(() => new Promise(resolve => resolve([{name: 'test1', balance: 10, high: 10}, {name: 'test2', balance: 12, high: 12}])));

  const bank = new Bank(opts);
  expect(bank.status()).toBe('');

  bank.deposits.player = { balance: 111, high: 1000 };
  const b = bank.deposits.player.balance;
  const h = bank.deposits.player.high;
  expect(bank.status()).toBe(`player, amount: $${b}, high score: $${h}, distance from high: $${Math.abs(b - h)}`);

  return bank.init(() => {
    expect(findSpy).toHaveBeenCalledTimes(1);

    expect(bank.status()).toBe([
      'test1, amount: $10, high score: $10, distance from high: $0',
      'test2, amount: $12, high score: $12, distance from high: $0',
    ].join('\n'));
  });
});