'use strict';
const Controller = require('../controller.js');
const Wagers = require('../wagers.js');

test('controller mappings work as expected', () => {
  const m = Controller.mappings();
  const cmds = Object.keys(m);
  const random = Math.floor(cmds.length * Math.random());
  const cmd = cmds[random];

  expect(typeof m).toBe('object');
  expect(typeof m[cmd].description).toBe('string');
  expect(typeof m[cmd].fn).toBe('function');
});

test('controller bank status handler', async () => {
  const craps = { bank: { status: () => {} } };
  const output = { sendFn: () => {} };
  const bankSpy = jest.spyOn(craps.bank, 'status').mockImplementation();
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleBankStatus(craps, 'player', null, output.sendFn);

  expect(bankSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledTimes(1);
});

test('controller bank handler', async() => {
  // when action is something other than deposit or withdraw
  const unknownAction = 'hdiaowhd';
  const craps = { bank: {} };
  const output = { sendFn: () => {} };
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleBank(craps, 'player', { action: unknownAction }, output.sendFn);

  expect(outputSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledWith(`Bank action ${unknownAction} unknown, must use "withdraw" or "deposit"`);

  // when player is trying to deposit but not in game
  const craps1 = { bank: {}, players: {} };
  const output1 = { sendFn: () => {} };
  const output1Spy = jest.spyOn(output1, 'sendFn').mockImplementation();
  await Controller.handleBank(craps1, 'player', { action: 'deposit' }, output1.sendFn);

  expect(output1Spy).toHaveBeenCalledTimes(1);
  expect(output1Spy).toHaveBeenCalledWith('Must be in game to deposit/withdraw money');

  // when player tries to pull more off the table than they have
  const craps2 = { bank: {}, players: { player2: { pot: 120 } } };
  const output2 = { sendFn: () => {} };
  const output2Spy = jest.spyOn(output2, 'sendFn').mockImplementation();
  await Controller.handleBank(craps2, 'player2', { action: 'deposit', amount: '120.0001' }, output2.sendFn);

  expect(output2Spy).toHaveBeenCalledTimes(1);
  expect(output2Spy).toHaveBeenCalledWith('Cannot pull more money off the table than you actually have');

  // when the bank action throws an exception
  const random3Action = 'deposit';
  const random3Handler = random3Action === 'deposit' ? 'handleDeposit' : 'handleWithdrawal';
  const random3Amount = 100 * Math.random();
  const craps3 = { bank: { status: () => {} }, players: { player3: { pot: 100 } } };
  craps3.bank[random3Handler] = () => {};
  const output3 = { sendFn: () => {} };
  const action3Spy = jest.spyOn(craps3.bank, random3Handler).mockImplementation(() => { throw new Error('error'); });
  const output3Spy = jest.spyOn(output3, 'sendFn').mockImplementation();
  await Controller.handleBank(craps3, 'player3', { action: random3Action, amount: random3Amount }, output3.sendFn);

  expect(action3Spy).toHaveBeenCalledTimes(1);
  expect(output3Spy).toHaveBeenCalledTimes(1);
  expect(output3Spy).toHaveBeenCalledWith('error');

  // when the bank withdraw goes through successfully
  const starting4Pot = 123;
  const random4Action = 'withdraw';
  const random4Handler = 'handleWithdrawal';
  const random4Amount = starting4Pot * Math.random();
  const craps4 = { bank: { status: () => {} }, players: { player4: { pot: starting4Pot } } };
  craps4.bank[random4Handler] = () => {};
  const output4 = { sendFn: () => {} };
  const action4Spy = jest.spyOn(craps4.bank, random4Handler).mockImplementation();
  const status4Spy = jest.spyOn(craps4.bank, 'status').mockImplementation(() => 'bank status');
  const output4Spy = jest.spyOn(output4, 'sendFn').mockImplementation();
  await Controller.handleBank(craps4, 'player4', { action: random4Action, amount: random4Amount }, output4.sendFn);

  expect(action4Spy).toHaveBeenCalledTimes(1);
  expect(status4Spy).toHaveBeenCalledTimes(1);
  expect(output4Spy).toHaveBeenCalledTimes(2);
  expect(output4Spy).toHaveBeenNthCalledWith(1, 'bank status');
  expect(output4Spy).toHaveBeenNthCalledWith(2, `player4 moved ${random4Amount} ${'deposit' === random4Action ? 'off' : 'to'} the table`);
  expect(craps4.players.player4.pot).toBe(starting4Pot + random4Amount);

  // when the bank deposit goes through successfully
  const starting5Pot = 123;
  const random5Action = 'deposit';
  const random5Handler = 'handleDeposit';
  const random5Amount = starting5Pot * Math.random();
  const craps5 = { bank: { status: () => {} }, players: { player5: { pot: starting5Pot } } };
  craps5.bank[random5Handler] = () => {};
  const output5 = { sendFn: () => {} };
  const action5Spy = jest.spyOn(craps5.bank, random5Handler).mockImplementation();
  const status5Spy = jest.spyOn(craps5.bank, 'status').mockImplementation(() => 'bank status');
  const output5Spy = jest.spyOn(output5, 'sendFn').mockImplementation();
  await Controller.handleBank(craps5, 'player5', { action: random5Action, amount: random5Amount }, output5.sendFn);

  expect(action5Spy).toHaveBeenCalledTimes(1);
  expect(status5Spy).toHaveBeenCalledTimes(1);
  expect(output5Spy).toHaveBeenCalledTimes(2);
  expect(output5Spy).toHaveBeenNthCalledWith(1, 'bank status');
  expect(output5Spy).toHaveBeenNthCalledWith(2, `player5 moved ${random5Amount} ${'deposit' === random5Action ? 'off' : 'to'} the table`);
  expect(craps5.players.player5.pot).toBe(starting5Pot - random5Amount);
});

test('controller bet handler', async () => {
  // when unknown bet is placed
  const craps = { Dealer: { getBets: () => {} } };
  const output = { sendFn: () => {} };
  const betSpy = jest.spyOn(craps.Dealer, 'getBets').mockImplementation(() => { return  { 'testbet': true }; });
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleBet(craps, 'player', { name: 'unknownbet', 'amount': 10 }, output.sendFn);

  expect(betSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledWith('Unknown bet: unknownbet');

  // when non-numerical bet is placed
  const craps1 = { Dealer: { getBets: () => {} } };
  const output1 = { sendFn: () => {} };
  const bet1Spy = jest.spyOn(craps1.Dealer, 'getBets').mockImplementation(() => { return  { 'testbet': true }; });
  const output1Spy = jest.spyOn(output1, 'sendFn').mockImplementation();
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': true }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': [] }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': {} }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': '' }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': null }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': undefined }, output1.sendFn);
  await Controller.handleBet(craps1, 'player1', { name: 'testbet', 'amount': NaN }, output1.sendFn);

  expect(bet1Spy).toHaveBeenCalledTimes(7);
  expect(output1Spy).toHaveBeenCalledTimes(7);
  expect(output1Spy).toHaveBeenNthCalledWith(1, 'Cannot place bet: true, amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(2, 'Cannot place bet: , amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(3, 'Cannot place bet: [object Object], amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(4, 'Cannot place bet: , amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(5, 'Cannot place bet: null, amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(6, 'Cannot place bet: undefined, amount must be a positive number');
  expect(output1Spy).toHaveBeenNthCalledWith(7, 'Cannot place bet: NaN, amount must be a positive number');

  // when non-positive bet is placed
  const craps2 = { Dealer: { getBets: () => {} } };
  const output2 = { sendFn: () => {} };
  const bet2Spy = jest.spyOn(craps2.Dealer, 'getBets').mockImplementation(() => { return  { 'testbet': true }; });
  const output2Spy = jest.spyOn(output2, 'sendFn').mockImplementation();
  await Controller.handleBet(craps2, 'player2', { name: 'testbet', 'amount': 0 }, output2.sendFn);
  await Controller.handleBet(craps2, 'player2', { name: 'testbet', 'amount': -.0001 }, output2.sendFn);

  expect(bet2Spy).toHaveBeenCalledTimes(2);
  expect(output2Spy).toHaveBeenCalledTimes(2);
  expect(output2Spy).toHaveBeenNthCalledWith(1, 'Cannot place bet: 0, amount must be a positive number');
  expect(output2Spy).toHaveBeenNthCalledWith(2, 'Cannot place bet: -0.0001, amount must be a positive number');

  // when bet request fails
  const craps3 = { Dealer: { getBets: () => {}, requestBet: () => {} } };
  const output3 = { sendFn: () => {} };
  const bet3Spy = jest.spyOn(craps3.Dealer, 'getBets').mockImplementation(() => { return { 'testbet': true }; });
  const request3Spy = jest.spyOn(craps3.Dealer, 'requestBet').mockImplementation(() => { return false; });
  const output3Spy = jest.spyOn(output3, 'sendFn').mockImplementation();
  await Controller.handleBet(craps3, 'player3', { name: 'testbet', 'amount': 11 }, output3.sendFn);
  expect(bet3Spy).toHaveBeenCalledTimes(1);
  expect(request3Spy).toHaveBeenCalledTimes(1);
  expect(output3Spy).toHaveBeenCalledTimes(1);
  expect(output3Spy).toHaveBeenCalledWith('player3 failed to place bet: testbet for amount: 11');

  // when bet request succeeds
  const craps4 = { Dealer: { getBets: () => {}, requestBet: () => {} } };
  const output4 = { sendFn: () => {} };
  const bet4Spy = jest.spyOn(craps4.Dealer, 'getBets').mockImplementation(() => { return { 'testbet': true }; });
  const request4Spy = jest.spyOn(craps4.Dealer, 'requestBet').mockImplementation(() => { return true; });
  const output4Spy = jest.spyOn(output4, 'sendFn').mockImplementation();
  await Controller.handleBet(craps4, 'player4', { name: 'testbet', 'amount': 111 }, output3.sendFn);

  expect(bet4Spy).toHaveBeenCalledTimes(1);
  expect(request4Spy).toHaveBeenCalledTimes(1);
  expect(output4Spy).toHaveBeenCalledTimes(0);
});

test('controller cash reset handler', async () => {
  // when player has less than $100
  const craps = { players: { player: { pot: 99.9999 } } };
  const output = { sendFn: () => {} };
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleCashReset(craps, 'player', null, output.sendFn);

  expect(outputSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledWith('$100 added to player pot');
  expect(craps.players.player.pot).toBe(199.9999);

  // when player has more than $100
  const craps1 = { players: { player1: { pot: 100.0001 } } };
  const output1 = { sendFn: () => {} };
  const output1Spy = jest.spyOn(output1, 'sendFn').mockImplementation();
  await Controller.handleCashReset(craps1, 'player1', null, output1.sendFn);

  expect(output1Spy).toHaveBeenCalledTimes(1);
  expect(output1Spy).toHaveBeenCalledWith('nice try');
  expect(craps1.players.player1.pot).toBe(100.0001);
});

test('controller dice status handler', async () => {
  const craps = { dice: { odds: () => {} } };
  const output = { sendFn: () => {} };
  const diceSpy = jest.spyOn(craps.dice, 'odds').mockImplementation();
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleDice(craps, 'player', null, output.sendFn);

  expect(diceSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledTimes(1);
});

test('controller exit handler', async () => {
  const craps = { Dealer: { requestPlayerRemoval: () => {} } };
  const dealerSpy = jest.spyOn(craps.Dealer, 'requestPlayerRemoval').mockImplementation();
  await Controller.handleExit(craps, 'player', null, null);

  expect(dealerSpy).toHaveBeenCalledTimes(1);
  expect(dealerSpy).toHaveBeenCalledWith(craps, 'player');
});

test('controller help handler', async () => {
  const output = { sendFn: () => {} };
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleHelp(undefined, 'player', undefined, output.sendFn);

  expect(outputSpy).toHaveBeenCalledTimes(1);
});

test('controller join handler', async () => {
  // no op in single player mode
  const craps = { mode: 'single' };
  const output = { sendFn: () => {} };
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleJoin(craps, 'player', undefined, output.sendFn);

  expect(outputSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledWith('join command doesn\'t do anything in single player mode');

  // normal operation
  const craps1 = { Dealer: { requestPlayerJoin: () => {} } };
  const craps1Spy = jest.spyOn(craps1.Dealer, 'requestPlayerJoin').mockImplementation();
  await Controller.handleJoin(craps1, 'player1', undefined, undefined);

  expect(craps1Spy).toHaveBeenCalledTimes(1);
  expect(craps1Spy).toHaveBeenCalledWith(craps1, 'player1');

  // behavior when exception is thrown
  const craps2 = { Dealer: { requestPlayerJoin: () => {} } };
  const output2 = { sendFn: () => {} };
  const craps2Spy = jest.spyOn(craps2.Dealer, 'requestPlayerJoin').mockImplementation(() => { throw new Error('error'); });
  const output2Spy = jest.spyOn(output2, 'sendFn').mockImplementation();
  await Controller.handleJoin(craps2, 'player2', undefined, output2.sendFn);

  expect(craps2Spy).toHaveBeenCalledTimes(1);
  expect(craps2Spy).toHaveBeenCalledWith(craps2, 'player2');
  expect(output2Spy).toHaveBeenCalledTimes(1);
  expect(output2Spy).toHaveBeenCalledWith(new Error('error'));
});

test('controller roll handler', async () => {
  // when there aren't any active wagers on the board
  const craps = { players: { player: { wagers: { isActive: () => {} } } } };
  const output = { sendFn: () => {} };
  const rollSpy = jest.spyOn(craps.players.player.wagers, 'isActive').mockImplementation(() => false);
  const outputSpy = jest.spyOn(output, 'sendFn').mockImplementation();
  await Controller.handleRoll(craps, 'player', null, output.sendFn);

  expect(rollSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledTimes(1);
  expect(outputSpy).toHaveBeenCalledWith('A bet must be placed before the dice can be rolled');

  // when shooter is another player
  const craps1 = { shooter: 'player', players: { player1: { wagers: { isActive: () => {} } } } };
  const output1 = { sendFn: () => {} };
  const roll1Spy = jest.spyOn(craps1.players.player1.wagers, 'isActive').mockImplementation(() => true);
  const output1Spy = jest.spyOn(output1, 'sendFn').mockImplementation();
  await Controller.handleRoll(craps1, 'player1', null, output1.sendFn);

  expect(roll1Spy).toHaveBeenCalledTimes(1);
  expect(output1Spy).toHaveBeenCalledTimes(1);
  expect(output1Spy).toHaveBeenCalledWith('/giphy "you weren\'t supposed to do that"');

  // when the current player is the shooter
  const craps2 = {
    shooter: 'player2',
    players: { player2: { wagers: { isActive: () => {} } } },
    dice: { roll: () => {} },
    Dealer: { manage: () => {} }
  };

  const output2 = { sendFn: () => {} };
  const roll2Spy = jest.spyOn(craps2.players.player2.wagers, 'isActive').mockImplementation(() => true);
  const dice2Spy = jest.spyOn(craps2.dice, 'roll').mockImplementation();
  const dealer2Spy = jest.spyOn(craps2.Dealer, 'manage').mockImplementation();
  const output2Spy = jest.spyOn(output2, 'sendFn').mockImplementation();
  await Controller.handleRoll(craps2, 'player2', null, output2.sendFn);

  expect(roll2Spy).toHaveBeenCalledTimes(1);
  expect(output2Spy).toHaveBeenCalledTimes(0);
  expect(dice2Spy).toHaveBeenCalledTimes(1);
  expect(dealer2Spy).toHaveBeenCalledTimes(1);
  expect(dealer2Spy).toHaveBeenCalledWith(craps2);
});

test('controller game status handler', async () => {
  const craps = {
    Dealer: { getBets: () => { return { pass: 123 }; } },
    shooter: null,
    dice: {},
    rotation: ['player1', 'player'],
    players: {
      player: {
        pot: 111,
        wagers: new Wagers()
      },
      player1: {
        pot: 222,
        wagers: new Wagers()
      }
    }
  };

  const obj = { sendFn: () => {} };
  const sendSpy = jest.spyOn(obj, 'sendFn').mockImplementation();

  // when dice aren't set
  await Controller.handleStatus(craps, 'player', undefined, sendSpy);

  // when dice are set
  craps.dice.value = 4;
  await Controller.handleStatus(craps, 'player', undefined, sendSpy);

  // when a player has wagers set
  craps.players.player1.wagers.pass = 10;
  await Controller.handleStatus(craps, 'player1', undefined, sendSpy);

  // when the shooter is set
  craps.shooter = 'player';
  await Controller.handleStatus(craps, 'player1', undefined, sendSpy);

  // when the point is set
  craps.point = 9;
  await Controller.handleStatus(craps, 'player1', undefined, sendSpy);
  
  // when the mode is multiplayer
  craps.mode = 'multi';
  await Controller.handleStatus(craps, 'player', undefined, sendSpy);

  jest.restoreAllMocks();
});

test('controller input handler', async () => {
  // when cmd escapes
  const craps = { Dealer: { keepAlive: () => {} } };
  const dealerSpy = jest.spyOn(craps.Dealer, 'keepAlive').mockImplementation();
  const controllerSpy = jest.spyOn(Controller, 'mappings');
  const handlerSpy = jest.spyOn(Controller, 'handleHelp').mockImplementation();
  await Controller.input(craps, 'player', 'help', undefined, undefined);

  expect(controllerSpy).toHaveBeenCalledTimes(1);
  expect(dealerSpy).toHaveBeenCalledTimes(1);
  expect(handlerSpy).toHaveBeenCalledTimes(1);
  expect(handlerSpy).toHaveBeenCalledWith(craps, 'player', { prefix: '' }, console.log);

  // when cmd w/ args escapes
  const craps1 = { Dealer: { keepAlive: () => {} } };
  const dealer1Spy = jest.spyOn(craps1.Dealer, 'keepAlive').mockImplementation();
  const handler1Spy = jest.spyOn(Controller, 'handleBank').mockImplementation();
  await Controller.input(craps1, 'player1', 'bank withdraw 10', undefined, undefined);

  expect(controllerSpy).toHaveBeenCalledTimes(2);
  expect(dealer1Spy).toHaveBeenCalledTimes(1);
  expect(handler1Spy).toHaveBeenCalledTimes(1);
  expect(handler1Spy).toHaveBeenCalledWith(craps1, 'player1', { prefix: '', action: 'withdraw', amount: '10' }, console.log);

  // when cmd reaches the end
  const craps2 = { Dealer: { keepAlive: () => {} } };
  const dealer2Spy = jest.spyOn(craps2.Dealer, 'keepAlive').mockImplementation();
  const handler2Spy = jest.spyOn(Controller, 'handleRoll').mockImplementation();
  const status2Spy = jest.spyOn(Controller, 'handleStatus').mockImplementation();
  await Controller.input(craps2, 'player2', 'roll');

  expect(controllerSpy).toHaveBeenCalledTimes(3);
  expect(dealer2Spy).toHaveBeenCalledTimes(1);
  expect(handler2Spy).toHaveBeenCalledTimes(1);
  expect(handler2Spy).toHaveBeenCalledWith(craps2, 'player2', { prefix: '' }, console.log);
  expect(status2Spy).toHaveBeenCalledTimes(1);
  expect(status2Spy).toHaveBeenNthCalledWith(1, craps2, 'player2', { prefix: '' }, console.log);

  // when cmd w/ args reaches the end
  const craps3 = { Dealer: { keepAlive: () => {} } };
  const dealer3Spy = jest.spyOn(craps3.Dealer, 'keepAlive').mockImplementation();
  const handler3Spy = jest.spyOn(Controller, 'handleBet').mockImplementation();
  await Controller.input(craps3, 'player3', 'bet pass 15', undefined, undefined);

  expect(controllerSpy).toHaveBeenCalledTimes(4);
  expect(dealer3Spy).toHaveBeenCalledTimes(1);
  expect(handler3Spy).toHaveBeenCalledTimes(1);
  expect(handler3Spy).toHaveBeenCalledWith(craps3, 'player3', { prefix: '', name: 'pass', amount: '15' }, console.log);
  expect(status2Spy).toHaveBeenCalledTimes(2);
  expect(status2Spy).toHaveBeenNthCalledWith(2, craps3, 'player3', { prefix: '' }, console.log);

  // when cmd isn't recognized
  const fakeCmd = 'this isn\'t a real cmd';
  const craps4 = { Dealer: { keepAlive: () => {} } };
  const output4 = { sendFn: () => {} };
  const dealer4Spy = jest.spyOn(craps4.Dealer, 'keepAlive').mockImplementation();
  const output4Spy = jest.spyOn(output4, 'sendFn').mockImplementation();
  await Controller.input(craps4, 'player4', fakeCmd, output4.sendFn, undefined);

  expect(controllerSpy).toHaveBeenCalledTimes(5);
  expect(dealer4Spy).toHaveBeenCalledTimes(1);
  expect(output4Spy).toHaveBeenCalledTimes(1);
  expect(output4Spy).toHaveBeenCalledWith(`Unrecognized cmd: ${fakeCmd}`);
});