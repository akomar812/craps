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

    this.place4 = 0;
    this.place5 = 0;
    this.place6 = 0;
    this.place8 = 0;
    this.place9 = 0;
    this.place10 = 0;

    this.big6 = 0;
    this.big8 = 0;

    this.hard4 = 0;
    this.hard6 = 0;
    this.hard8 = 0;
    this.hard10 = 0;
  }

  isActive() {
    for (let key in this) {
      if (this[key] > 0) {
        return true;
      }
    }

    return false;
  }

  report() {
    for (let key in this) {
      if (this[key] > 0) {
        console.log(`${key}: ${this[key]}`);
      }
    }
  }
}

module.exports = Wagers;

