'use strict';
const Craps = require('./craps.js');
const readline = require('readline');
const Table = require('cli-table');
const PS1 = '> ';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleBet = (game, player, bet, amount, send=console.log) => {
  const bets = game.Dealer.getBets();

  if (!(bet in bets)) {
    return send(`Unknown bet: ${bet}`);
  }

  if (!Number.isFinite(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return send(`Cannot place bet: ${amount}, amount must be positive number`);
  }

  if (!game.Dealer.requestBet(game, player, bet, amount)) {
    send(`${player} failed to place bet: ${bet} for amount: ${amount}`);
  }
};

const handleRoll = (game, player, send=console.log) => {
  if (!game.players[player].wagers.isActive()) {
    return send('A bet must be placed before the dice can be rolled');
  }

  if (game.shooter !== player) {
    return send('YOU WERENT SUPPOSED TO DO THAT');
  }

  game.Dealer.manage(game);
};

const handleStatus = (game, send=console.log) => {
  const bets = game.Dealer.getBets();

  const gameTable = new Table({
    chars: {
      'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
      'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
      'left': '' , 'left-mid': '' , 'mid-right': '', 'mid': '' , 'mid-mid': '', 'mid-left': '', 'right': '' ,
      'right-mid': '' , 'middle': ''
    },
    style: {
      head: [],
      border: []
    }
  });

  const wagerTable = new Table({
    head: [''].concat(Object.keys(game.players)), 
    chars: {
      'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
      'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
      'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '', 'right': '' ,
      'right-mid': '' , 'middle': ''
    },
    style: {
      head: [],
      border: []
    }
  });

  const lastRoll = game.dice.value > 0 ? `${game.dice.value} (${game.dice.current})` : 'none';

  const playerInfo = Object.keys(game.players).map((p) => {
    const totalWagered = game.players[p].wagers.total();
    const wagerStr = totalWagered > 0 ? ` [${totalWagered} wagered]` : '';
    return `${p} (${game.players[p].pot}${wagerStr})`;
  }).join('\n');

  gameTable.push({ 'Shooter': game.shooter ? game.shooter : 'need a player' });
  gameTable.push({ 'Last Roll': lastRoll });
  gameTable.push({ 'Point': game.point ? game.point : 'not set' });
  gameTable.push({ 'Players': playerInfo });

  for (let bet in bets) {
    const playerBets = [];
    
    for (let player in game.players) {
      playerBets.push(game.players[player].wagers[bet]);
    }

    wagerTable.push({ [bet]: playerBets } );
  }

  send(gameTable.toString());
  send(wagerTable.toString());
};

const handleJoin = (game, player, send) => {
  try {
    game.addPlayer(player);
  } catch(e) {
    send(e);
  }
};

const handleHelp = (opts={}, send=console.log) => {
  const pfx = opts.prefix || '';

  send([
    `${pfx}exit                     leave the table`,
    `${pfx}help                     show this`,
    `${pfx}join                     join as a new player starting with $100`,
    `${pfx}bet [name] [amount]      make a wager on the craps table`,
    `${pfx}roll                     roll the dice`,
  ].join('\n'));
};

const textInterface = (game, player, msg) => {
  handleStatus(game);

  rl.question(msg, (answer) => {
    const comps = answer.split(' ');

    switch(comps[0]) {
    case 'exit':
      return rl.close();
    case 'roll':
      handleRoll(game, 'player');
      break;
    case 'bet':
      handleBet(game, 'player', comps[1], comps[2]);
      break;
    }

    textInterface(game, player, PS1);
  });
};
  
module.exports.asyncInterface = (opts={ prefix: '' }) => {
  const craps = new Craps();

  return (player, cmd, send) => {
    const comps = cmd.split(' ');

    switch(comps[0]) {
    case 'exit':
      return craps.removePlayer(player);
    case 'help':
      return handleHelp({ prefix: opts.prefix }, send);
    case 'join':
      handleJoin(craps, player, send);
      break;
    case 'roll':
      handleRoll(craps, player, send);
      break;
    case 'bet':
      handleBet(craps, player, comps[1], comps[2], send);
      break;
    }

    handleStatus(craps, send);
  };
};

module.exports.cli = (args) => {
  const craps = new Craps();
  const player = args.playerName || 'player';
  const pot = args.pot || 1000;
  craps.addPlayer(player, pot);
  textInterface(craps, player, `${player} connected to craps table...\n${PS1}`);
};