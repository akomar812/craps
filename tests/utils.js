'use strict';
const Dice = require('../dice.js');

module.exports.getTargetExpectedValue = (d0, d1, target) => {
  const roll = d0 + d1;

  if (roll === target) {
    return true;
  } else if (roll === 7) {
    return false;
  }
};

module.exports.getBigBetExpectedValue = (d0, d1, target) => {
  const roll = d0 + d1;

  if (roll === target) {
    return true;
  } else if (roll === 7) {
    return false;
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
  return Dice._getRoll()+Dice._getRoll();
};

module.exports.getRandomPoint = (avoid) => {
  const roll = module.exports.getRandomRoll();
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