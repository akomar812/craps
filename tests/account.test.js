'use strict';

test('account interface is as expected', async () => {
  const Account = require('../account.js')(require('../utils.js').dbInterface(':memory:', process.stdout));
  await Account.sync();

  const account = await Account.create({name:'test', balance: 5, high: 10});
  expect(account.name).toBe('test');
  expect(account.balance).toBe(5);
  expect(account.high).toBe(10);

  const account1 = await account.deposit(12);
  expect(account1.balance).toBe(17);
  expect(account1.high).toBe(17);

  expect(() => account.deposit(-.01)).rejects.toThrow('Transaction amount can\'t be negative');

  const account2 = await account.withdraw(4);
  expect(account2.balance).toBe(13);
  expect(account2.high).toBe(17);

  const account3 = await account.deposit(3);
  expect(account3.balance).toBe(16);
  expect(account3.high).toBe(17);

  expect(() => account.withdraw(100000)).rejects.toThrow(`Withdrawal amount $100000 is more than you have deposited $${account2.balance}`);
});
