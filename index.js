'use strict';
const Craps = require('./craps.js');
const readline = require('readline');
const Table = require('cli-table');
const PS1 = '> ';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleBet = (game, bet, amount) => {
  if (!Number.isFinite(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return console.log(`Cannot place bet: ${amount}, amount must be positive number`);
  }

  if (!game.Dealer.requestBet(game, game.players.player.wagers, bet, amount)) {
    console.log(`Failed to place bet: ${bet} for amount: ${amount}`);
  }
};

const handleRoll = (game) => {
  if (game.players.player.wagers.isActive()) {
    game.dice.roll();
    game.Dealer.manage(game);
  } else {
    console.log('A bet must be placed before the dice can be rolled');
  }
};

const handleStatus = (game) => {
  const bets = game.Dealer.getBets();
  const gameTable = new Table();
  const wagerTable = new Table({ head: [''].concat(Object.keys(bets)) });

  const lastRoll = game.dice.value > 0 ? `${game.dice.value} (${game.dice.current})` : 'none';

  gameTable.push({ 'Last Roll': lastRoll });
  gameTable.push({ 'Point': game.point ? game.point : 'not set' });
  gameTable.push({ 'Players': Object.keys(game.players).map(p => `${p} (${game.players[p].pot})`).join('\n') });

  for (let player in game.players) {
    const playerBets = [];

    for (let bet in bets) {
      playerBets.push(game.players[player].wagers[bet]);
    }

    wagerTable.push(
      { [player]: playerBets }
    );
  }

  console.log(gameTable.toString());
  console.log(wagerTable.toString());
};

const textInterface = (game, player, msg) => {
  handleStatus(game);

  rl.question(msg, (answer) => {
    const comps = answer.split(' ');

    switch(comps[0]) {
    case 'exit':
      return rl.close();
    case 'roll':
      handleRoll(game);
      break;
    case 'bet':
      handleBet(game, comps[1], comps[2]);
      break;
    }

    textInterface(game, player, PS1);
  });
};

module.exports = (args) => {
  const craps = new Craps();
  const player = args.playerName || 'player';
  const pot = args.pot || 1000;
  craps.addPlayer(player, pot);
  textInterface(craps, player, `${player} connected to craps table...\n${PS1}`);
};
