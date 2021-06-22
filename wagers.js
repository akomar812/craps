'use strict';

class Wagers {
  constructor() {
    this.pass = 0;
    this.two = 0;
    this.three = 0;
    this.eleven = 0;
    this.twelve = 0;
    this.any7 = 0;
    this.anyCraps = 0;

    this.come = {
      pass: 0,
      point: null
    };

    this.place = {
      '4': 0,
      '5': 0,
      '6': 0,
      '8': 0,
      '9': 0,
      '10': 0
    };

    this.big = {
      '6': 0,
      '8': 0
    };

    this.hard = {
      '4': 0,
      '6': 0,
      '8': 0,
      '10': 0
    };
  }

  isActive() {
    for (let key in this) {
      if (Number.isInteger(this[key])) {
        if (this[key] > 0) {
          return true;
        }
      } else {
        for (let subkey in this[key]) {
          if (this[key][subkey] > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }
}

module.exports = Wagers;

