'use strict';
const Craps = require('./craps.js');
const DB = require('./models.js');
const Controller = require('./controller.js');
const getDBConnector = require('./utils.js').dbInterface;

module.exports = async (opts={prefix: '', dbTarget: ':memory:', dbLogStream: process.stdout }) => {
  const connector = getDBConnector(opts.dbTarget, opts.dbLogStream);
  const Models = await DB(connector);
  const craps = new Craps({ Models: Models, mode: 'multi' });

  await craps.init();

  return async (player, cmd, send) => {
    await Controller.input(craps, player, cmd, send, opts);
    return craps;
  };
};