'use strict';
const { Sequelize } = require('sequelize');
const fs = require('fs');

module.exports.mod = (n, m) => {
  return ((n%m)+m)%m;
};

module.exports.dbInterface = (target) => {
  const logFileStream = target === ':memory:' ? process.stdout : fs.createWriteStream(`./var/log/db.${(new Date()).getTime()}`, { flags: 'a' });

  return new Sequelize(`sqlite:${target}`, {
    logging: msg => logFileStream.write(msg+'\n')
  });
};