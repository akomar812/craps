'use strict';

module.exports = (sqlize) => {
  const promises = [];

  const Models = {
    Account: require('./account.js')(sqlize)
  };

  for (let model in Models) {
    promises.push(Models[model].sync());
  }

  return Promise.all(promises).then(() => Models);
};