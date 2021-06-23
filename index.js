'use strict';
const Craps = require('./craps.js');
const readline = require('readline');
const PS1 = '> ';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleBet = (game, bet, amount) => {
  if (!Number.isFinite(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return console.log(`Cannot place bet: ${amount}, amount must be positive number`);
  }

  game.Dealer.requestBet(game, game.wagers.player, bet, amount) ?
    console.log(`Successfully placed bet: ${bet} for amount: ${amount}`) :
    console.log(`Failed to place bet: ${bet} for amount: ${amount}`);
};

const handleRoll = (game) => {
  if (game.wagers.player.isActive()) {
    game.dice.roll();
    game.Dealer.manage(game);
  } else {
    console.log('A bet must be placed before the dice can be rolled');
  }
};

const textInterface = (game, player, msg) => {
  rl.question(msg, (answer) => {
    const comps = answer.split(' ');
    switch(comps[0]) {
    case 'exit':
      return rl.close();
    case 'status':
      console.log(`Point currently set to: ${game.point}`);
      break;
    case 'pot':
      console.log(`Current pot value: ${game.payout}`);
      break;
    case 'wagers':
      game.wagers.player.report();
      break;
    case 'roll':
      handleRoll(game);
      break;
    case 'bet':
      handleBet(game, comps[1], comps[2]);
      break;
    default:
      console.log(`Received message: ${answer}`);
    }

    textInterface(game, player, PS1);
  });
};

module.exports = (args) => {
  const craps = new Craps({ debug: true });
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
