'use strict';
const Come = require('../bets/come.js');
const utils = require('./utils.js');

test('pass constructor works as expected', () => {
  const come = new Come();
  expect(come.type).toBe('multi');
  expect(come.houseEdge).toBe(1.41);
  expect(come.payout).toStrictEqual({ '*': 1 });
});

test('come bet evaluation behaves as expects', () => {
  const come = new Come();

  for (var i=0; i<100; i++) {
    const roll = utils.getRandomRoll();
    const point = utils.getRandomPoint();
    const comePass = (Math.floor(2 * Math.random()) === 1 ? 10 : 0);
    const comePoint = (Math.floor(2 * Math.random()) === 1 ? utils.getRandomPoint(point) : null);
    let expected;

    if (roll === point) expected = undefined;
    else if (roll === 7 || roll === 11) expected = true;
    else if (roll === comePoint) expected = true;
    else if (roll === 2 || roll === 3 || roll === 12) expected = false;
    
    expect(come.evaluate(roll, point, { pass: comePass, point: comePoint })).toBe(expected);
  }
});
