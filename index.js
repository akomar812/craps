'use strict';
const Craps = require('./craps.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const textInterface = (game, player, msg) => {
  rl.question(msg, (answer) => {
    switch(answer) {
    case 'exit':
      return rl.close();
    case 'roll':
      if (game.wagers.player.isActive()) {
        game.dice.roll();
        console.log(`${player} rolled: ${game.dice.value} (${game.dice.current})`);
      } else {
        console.log('A bet must be placed before the dice can be rolled');
      }
      break;
    default:
      console.log(`Received message: ${answer}`);
    }

    textInterface(game, player, '> ');
  });
};

module.exports = (args) => {
  const craps = new Craps();
  const player = args.playerName || 'player';
  craps.addPlayer(player);
  textInterface(craps, player, `${player} connected to craps table...\n> `);
};
// const Craps = require('./craps.js');
// //const Strategy = require('./strategies/6_8_progression.js');
// const Strategy = require('./strategies/basic_pass_line.js');
// const target = 200;
// let total = 0;
// let count = 0;

// while (total < target) {
//   const game = new Craps({debug:true});
//   console.log('Starting game with total:', total);
//   game.play(new Strategy());
//   total += game.payout;
//   count++;
// }

// console.log('Took', count, 'games to reach $', target);
