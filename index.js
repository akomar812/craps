'use strict';
const Craps = require('./craps.js');
//const Strategy = require('./strategies/6_8_progression.js');
const Strategy = require('./strategies/basic_pass_line.js');
const target = 200;
let total = 0;
let count = 0;

while (total < target) {
  const game = new Craps({debug:true});
  console.log('Starting game with total:', total);
  game.play(new Strategy());
  total += game.payout;
  count++;
}

console.log('Took', count, 'games to reach $', target);
