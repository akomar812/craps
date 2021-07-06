'use strict';
const { Sequelize } = require('sequelize');
const Dice = require('./dice.js');

module.exports.mod = (n, m) => {
  return ((n%m)+m)%m;
};

module.exports.dbInterface = (target, stream) => {
  return new Sequelize(`sqlite:${target}`, {
    logging: msg => stream.write(msg+'\n')
  });
};

module.exports.pad = (set, item) => {
  // find the largest in the set and repeat ' ' (Set_largest - item.length) times
  return `${item}${' '.repeat(set.map(a => a.length).reduce((a, b) => Math.max(a, b)) - item.length)}`;
};

module.exports.getTargetExpectedValue = (roll, target) => {
  if (roll === target) {
    return true;
  } else if (roll === 7) {
    return false;
  }
};

module.exports.getTargetInverseExpectedValue = (roll, target) => {
  if (roll === target) {
    return false;
  } else if (roll === 7) {
    return true;
  }
};

module.exports.getHardWayExpectedValue = (d0, d1, target) => {
  if (d0 === d1 && d0 + d1 === target) {
    return true;
  } else if (d0 + d1 === target || d0 + d1 === 7) {
    return false;
  }
};

module.exports.getRandomRoll = () => {
  const d1 = Dice._getRoll();
  const d2 = Dice._getRoll();
  return { value: d1+d2 , dice: [d1, d2] };
};

module.exports.getRandomPoint = (avoid) => {
  const roll = module.exports.getRandomRoll().value;
  const validPoints = [4, 5, 6, 8, 9, 10];

  if (validPoints.indexOf(avoid) >= 0) {
    validPoints.splice(validPoints.indexOf(avoid), 1);
  }

  if (validPoints.indexOf(roll) >= 0) {
    return roll;
  } else {
    return module.exports.getRandomPoint(avoid);
  }
};
