'use strict';

class Wagers {
  constructor(opts={}) {
    this.debug = opts.debug || false;
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
}

module.exports = Wagers;

