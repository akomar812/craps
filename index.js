'use strict';
const Craps = require('./craps.js');
const readline = require('readline');
const Dealer = require('./dealer.js');
const PS1 = '> ';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const textInterface = (game, player, msg) => {
  rl.question(msg, (answer) => {
    const comps = answer.split(' ');
    switch(comps[0]) {
    case 'exit':
      return rl.close();
    case 'pot':
      console.log(`Current pot value: ${game.payout}`);
      break;
    case 'wagers':
      game.wagers.player.report();
      break;
    case 'roll':
      if (game.wagers.player.isActive()) {
        game.dice.roll();
        console.log(`${player} rolled: ${game.dice.value} (${game.dice.current})`);
        Dealer.manage(game);
      } else {
        console.log('A bet must be placed before the dice can be rolled');
      }
      break;
    case 'bet':
      if (!Number.isFinite(parseFloat(comps[2])) || parseFloat(comps[2]) <= 0) {
        console.log(`Cannot place bet: ${comps[2]}, amount must be positive number`);
        break;
      }

      game.Dealer.requestBet(game, game.wagers.player, comps[1], comps[2]) ?
        console.log(`Successfully placed bet: ${comps[1]} for amount: ${comps[2]}`) :
        console.log(`Failed to place bet: ${comps[1]} for amount: ${comps[2]}`);

      break;
    default:
      console.log(`Received message: ${answer}`);
    }

    textInterface(game, player, PS1);
  });
};

module.exports = (args) => {
  const craps = new Craps();
  const player = args.playerName || 'player';
  craps.addPlayer(player);
  textInterface(craps, player, `${player} connected to craps table...\n${PS1}`);
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
