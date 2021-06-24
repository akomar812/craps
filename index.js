'use strict';
const Craps = require('./craps.js');
const readline = require('readline');
const Table = require('cli-table');
const PS1 = '> ';

const tableOverride = {
  'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
  'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
  'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '', 'right': '' ,
  'right-mid': '' , 'middle': ''
};

const handleBet = (game, player, bet, amount, send=console.log) => {
  game.Dealer.keepAlive(game, player);
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
  game.Dealer.keepAlive(game, player);

  if (!game.players[player].wagers.isActive()) {
    return send('A bet must be placed before the dice can be rolled');
  }

  if (game.shooter !== player) {
    return send('/giphy "you weren\'t supposed to do that"');
  }

  game.dice.roll();
  game.Dealer.manage(game);
};

const handleStatus = (game, send=console.log) => {
  const bets = game.Dealer.getBets();

  const gameTable = new Table({
    chars: tableOverride,
    style: {
      head: [],
      border: []
    }
  });

  const wagerTable = new Table({
    head: [''].concat(Object.keys(game.players)), 
    chars: tableOverride,
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
  if (game.mode === 'single') {
    return send('join command doesn\'t do anything in single player mode');
  }

  try {
    game.Dealer.requestPlayerJoin(game, player);
  } catch(e) {
    send(e);
  }
};

const handleHelp = (opts={}, send=console.log) => {
  const pfx = opts.prefix || '';

  send([
    'craps game',
    '* Start game or join current game by running: !join',
    '* There must be at least one bet on the table before the shooter can roll',
    '* If a player or shooter is inactive for 1 minute they will be booted',
    '',
    `${pfx}exit                     leave the table`,
    `${pfx}help                     show this`,
    `${pfx}dice                     show possible dice rolls with expected outputs`,
    `${pfx}join                     join as a new player starting with $100`,
    `${pfx}bet [name] [amount]      make a wager on the craps table`,
    `${pfx}roll                     roll the dice`,
    `${pfx}reset cash               for when the tables turn against you`,
  ].join('\n'));
};

const handleExit = (game, player) => {
  // need to handle exit differently for cli
  game.Dealer.requestPlayerRemoval(game, player);
};

const handleDice = (send) => {
  const rolls = [
    'roll     chance             ways',
    '2        1 in 36 chance     1–1',
    '3        2 in 36 chance     1–2, 2–1',
    '4        3 in 36 chance     1–3, 2–2, 3–1',
    '5        4 in 36 chance     1–4, 2–3, 3–2, 4–1',
    '6        5 in 36 chance     1–5, 2–4, 3–3, 4–2, 5–1',
    '7        6 in 36 chance     1–6, 2–5, 3–4, 4–3, 5–2, 6–1',
    '8        5 in 36 chance     2–6, 3–5, 4–4, 5–3, 6–2',
    '9        4 in 36 chance     3–6, 4–5, 5–4, 6–3',
    '10       3 in 36 chance     4–6, 5–5, 6–4',
    '11       2 in 36 chance     5–6, 6–5',
    '12       1 in 36 chance     6–6'
  ];

  send(rolls.join('\n'));
};

const resetCash = (game, player, send) => {
  if (game.players[player].pot < 100) {
    send(`$100 added to ${player} pot`);
    game.players[player].pot += 100;
  } else {
    send('nice try');
  }
};

const controller = (craps, player, cmd, send, opts={ prefix: '' }) => {
  const comps = cmd.split(' ').map(c => c.trim());

  switch(comps[0]) {
  case 'exit':
    return handleExit(craps, player);
  case 'help':
    return handleHelp({ prefix: opts.prefix }, send);
  case 'dice':
    return handleDice(send);
  case 'join':
    handleJoin(craps, player, send);
    break;
  case 'roll':
    handleRoll(craps, player, send);
    break;
  case 'bet':
    handleBet(craps, player, comps[1], comps[2], send);
    break;
  case 'reset':
    resetCash(craps, player, send);
    break;
  default:
    return handleHelp({ prefix: opts.prefix }, send);
  }

  handleStatus(craps, send);
};
  
module.exports.textInterface = (opts={ prefix: '' }) => {
  const craps = new Craps({ mode: 'multi' });

  return (player, cmd, send) => {
    controller(craps, player, cmd, send, opts);
    return craps;
  };
};

module.exports.cli = (args) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const craps = new Craps();
  const player = args.playerName || 'player';
  const pot = args.pot || 1000;
  craps.addPlayer(player, pot);
  craps.shooter = player;
  cli(player, `${player} connected to craps table...\n${PS1}`);

  function cli(player, msg) {
    rl.question(msg, (answer) => {
      controller(craps, player, answer, console.log);
      cli(player, PS1);
    });
  }
};
