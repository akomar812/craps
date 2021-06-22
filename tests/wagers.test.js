'use strict';
const Wagers = require('../wagers.js');

test('wagers constructor works as expected', () => {
  const wagers = new Wagers();

  [
    'pass',
    'two',
    'three',
    'eleven',
    'twelve',
    'any7',
    'anyCraps'
  ].map(w => expect(wagers[w]).toBe(0));

  [
    '4',
    '5',
    '6',
    '8',
    '9',
    '10'
  ].map(w => expect(wagers.place[w]).toBe(0));

  [
    '6',
    '8'
  ].map(w => expect(wagers.big[w]).toBe(0));

  [
    '4',
    '6',
    '8',
    '10'
  ].map(w => expect(wagers.hard[w]).toBe(0));
});

test('pass bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.pass = 10;
  expect(wagers.isActive()).toBe(true);
});

test('two bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.two = 10;
  expect(wagers.isActive()).toBe(true);
});

test('three bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.three = 10;
  expect(wagers.isActive()).toBe(true);
});

test('eleven bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.eleven = 10;
  expect(wagers.isActive()).toBe(true);
});

test('twelve bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.twelve = 10;
  expect(wagers.isActive()).toBe(true);
});

test('any7 bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.any7 = 10;
  expect(wagers.isActive()).toBe(true);
});

test('anyCraps bets activates wagers', () => {
  const wagers = new Wagers();
  expect(wagers.isActive()).toBe(false);
  wagers.anyCraps = 10;
  expect(wagers.isActive()).toBe(true);
});
