'use strict';
const Table = require('cli-table');
const pad = require('./utils.js').pad;

const tableOverride = {
  'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
  'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
  'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '', 'right': '' ,
  'right-mid': '' , 'middle': ''
};

const tableStyleOverride = {
  head: [],
  border: []
};

class Controller {
  static mappings() {
    return {
      'exit': {
        description: 'leave the table',
        fn: Controller.handleExit,
        escapes: true
      },
      'help': {
        description: 'show usage information',
        fn: Controller.handleHelp,
        escapes: true
      },
      'dice': {
        description: 'show possible dice rolls with expected values',
        fn: Controller.handleDice,
        escapes: true
      },
      'status': {
        description: 'show the current game state',
        fn: Controller.handleStatus,
        escapes: true
      },
      'join': {
        description: 'join the current game or start a new one. New players start with $100, returning players can save their winnings in the bank',
        fn: Controller.handleJoin
      },
      'bet [name] [amount]': {
        description: 'make a wager at the craps table, the name of the bet is found on the craps table e.g. "pass", or "place6"',
        fn: Controller.handleBet,
        regex: /bet ([a-zA-Z]+)([0-9]{0,}) ([-]{0,}\d+)/g
      },
      'roll': {
        description: 'roll the dice when you are the shooter',
        fn: Controller.handleRoll
      },
      'reset cash': {
        description: 'for when the tables turn against you',
        fn: Controller.handleCashReset
      },
      'bank': {
        description: 'see bank players bank statements and high score information',
        fn: Controller.handleBankStatus,
        escapes: true
      },
      'bank [action] [amount]': {
        description: 'use actions "withdraw" or "deposit" to take winnings off of the table or pull money out of the bank',
        fn: Controller.handleBank,
        escapes: true,
        regex: /bank ([a-zA-Z]+) ([-]{0,}\d+)/g
      }
    };
  }

  static async handleBankStatus(game, player, opts, output) {
    output(game.bank.status());
  }

  static async handleBank(game, player, opts, output) {
    if (['withdraw', 'deposit'].indexOf(opts.action) < 0)  {
      return output(`Bank action ${opts.action} unknown, must use "withdraw" or "deposit"`);
    }
  
    if (!(player in game.players))  {
      return output('Must be in game to deposit/withdraw money');
    }
  
    const action = opts.action === 'withdraw' ? 'handleWithdrawal' : 'handleDeposit';
    const amount = parseFloat(opts.amount);
  
    if ('deposit' === opts.action && amount > game.players[player].pot) {
      return output('Cannot pull more money off the table than you actually have');
    }
  
    try {
      await game.bank[action](player, amount);
  
      if ('withdraw' === opts.action) {
        game.players[player].pot += amount;
      } else {
        game.players[player].pot -= amount;
      }
  
      output(game.bank.status());
      output(`${player} moved ${amount} ${'deposit' === opts.action ? 'off' : 'to' } the table`);
    } catch(e) {
      output(e.message);
    }
  }

  static async handleBet(game, player, opts, output) {
    const bets = game.Dealer.getBets();
  
    if (!(opts.name in bets)) {
      return output(`Unknown bet: ${opts.name}`);
    }
  
    if (!Number.isFinite(parseFloat(opts.amount)) || parseFloat(opts.amount) <= 0) {
      return output(`Cannot place bet: ${opts.amount}, amount must be a positive number`);
    }

    if (!game.Dealer.requestBet(game, player, opts.name, opts.amount)) {
      output(`${player} failed to place bet: ${opts.name} for amount: ${opts.amount}`);
    }

  }

  static async handleCashReset(game, player, opts, output) {
    if (game.players[player].pot < 100) {
      output(`$100 added to ${player} pot`);
      game.players[player].pot += 100;
    } else {
      output('nice try');
    }
  }

  static async handleDice(game, player, opts, output) {
    output(game.dice.odds());
  }

  static async handleExit(game, player) {
    return await game.Dealer.requestPlayerRemoval(game, player);
  }

  static async handleHelp(game, player, opts={}, output) {
    const pfx = opts.prefix || '';
    const m = Controller.mappings();
    const controls = Object.keys(m);

    output([
      'craps game',
      '* Start game or join current game by running: !join',
      '* There must be at least one bet on the table before the shooter can roll',
      '* If a player or shooter is inactive for 1 minute they will be booted',
      '',
      controls.map(h => `${pad(controls, h)}        ${m[h].description}`).map(h => pfx+h).join('\n')
    ].join('\n'));
  }

  static async handleJoin(game, player, opts, output) {
    if (game.mode === 'single') {
      return output('join command doesn\'t do anything in single player mode');
    }
  
    try {
      return await game.Dealer.requestPlayerJoin(game, player);
    } catch(e) {
      output(e);
    }
  }

  static async handleRoll(game, player, opts, output) {
    if (!game.players[player].wagers.isActive()) {
      return output('A bet must be placed before the dice can be rolled');
    }
  
    if (game.shooter !== player) {
      return output('/giphy "you weren\'t supposed to do that"');
    }
  
    game.dice.roll();
    game.Dealer.manage(game);
  }

  static async handleStatus(game, player, opts, output) {
    const bets = game.Dealer.getBets();
  
    const gameTable = new Table({
      chars: tableOverride,
      style: tableStyleOverride
    });
  
    const wagerTable = new Table({
      head: [''].concat(Object.keys(game.players)), 
      chars: tableOverride,
      style: tableStyleOverride
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
  
    if (game.mode === 'multi') {
      gameTable.push({ 'Shooting order:': game.rotation.map(s => s === game.shooter ? s+'<-' : s).join('\n') });
    }
  
    for (let bet in bets) {
      const playerBets = [];
      
      for (let player in game.players) {
        playerBets.push(game.players[player].wagers[bet]);
      }
  
      wagerTable.push({ [bet]: playerBets } );
    }
  
    output(gameTable.toString());
    output(wagerTable.toString());
  }

  static async input(craps, player, cmd, output=console.log, opts={ prefix: '' }) {
    craps.Dealer.keepAlive(craps, player);
    const m = Controller.mappings();
    let unrecognizedCmd = true;
    let res;

    for (let k in m) {
      const r = 'regex' in m[k] ? m[k].regex : new RegExp(`^${k}$`);

      if (r.test(cmd.trim())) {
        unrecognizedCmd = false;
        const args = Object.assign({}, opts);
        const comps = cmd.split(' ').map(c => c.trim().toLowerCase()).slice(1);

        if (comps.length > 0) {
          /**
           * turns cmd def, cmd components into arg dict
           * e.g. (bet [name] [amount], bet place6 10) -> { "name": "place6", "amount": 10 }
           */
          k.split(' ').slice(1).map(p => p.slice(1, p.length - 1)).map((p, i) => args[p] = comps[i]);
        }

        res = await m[k].fn(craps, player, args, output);

        if (m[k].escapes) {
          return res;
        }
      }
    }

    if (unrecognizedCmd) {
      output(`Unrecognized cmd: ${cmd}`);
    }

    await Controller.handleStatus(craps, player, opts, output);
    return res;
  }
}

module.exports = Controller;