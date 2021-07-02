'use strict';
const fs = require('fs');
const readline = require('readline');
const Craps = require('./craps.js');
const DB = require('./models.js');
const Controller = require('./controller.js');
const sequelize = require('./utils.js').dbInterface(`${__dirname}/var/data/db`, fs.createWriteStream(`${__dirname}/var/log/db.${(new Date()).getTime()}`, { flags: 'a' }));
const PS1 = '> ';

module.exports.textInterface = (opts={ prefix: '' }) => {
  return DB(sequelize).then((Models) => {
    const craps = new Craps({ Models: Models, mode: 'multi' });
    return craps.init().then(() => {
      return (player, cmd, send) => {
        Controller.input(craps, player, cmd, send, opts);
        return craps;
      };
    });
  });
};

module.exports.cli = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return DB(sequelize).then((Models) => {
    // start the game and cli
    const craps = new Craps({ Models: Models });

    craps.init().then(() => {
      cli('player', `player connected to craps table...\n${PS1}`);

      // save players pot in the bank on exit
      rl.on('close', () => craps.Dealer.requestPlayerRemoval(craps, 'player'));

      function cli(player, msg) {
        rl.question(msg, (answer) => {
          Controller.input(craps, player, answer, console.log);
          cli(player, PS1);
        });
      }
    });
  });
};
