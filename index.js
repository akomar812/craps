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

  game.Dealer.requestBet(game, game.players.player.wagers, bet, amount) ?
    console.log(`Successfully placed bet: ${bet} for amount: ${amount}`) :
    console.log(`Failed to place bet: ${bet} for amount: ${amount}`);
};

const handleRoll = (game) => {
  if (game.players.player.wagers.isActive()) {
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
      console.log(`Current pot value: ${game.players.player.pot}`);
      break;
    case 'wagers':
      game.players.player.wagers.report();
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
  const pot = args.pot || 1000;
  craps.addPlayer(player, pot);
  textInterface(craps, player, `${player} connected to craps table...\n${PS1}`);
};
