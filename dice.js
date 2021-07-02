'use strict';

class DicePair {
  constructor() {
    this.current = [];
    this.value = 0;
  }

  static _getRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  odds() {
    return [
      'roll     chance             ways',
      '2        1 in 36 chance     1–1',
      '3        2 in 36 chance     1–2, 2–1',
      '4        3 in 36 chance     1–3, 2–2, 3–1',
      '5        4 in 36 chance     1–4, 2–3, 3–2, 4–1',
      '6        5 in 36 chance     1–5, 2–4, 3–3, 4–2, 5–1',
      '7        6 in 36 chance     1–6, 2–5, 3–4, 4–3, 5–2, 6–1',
      '8        5 in 36 chance     2–6, 3–5, 4–4, 5–3, 6–2',
      '9        4 in 36 chance     3–6, 4–5, 5–4, 6–3',
      '10       3 in 36 chance     4–6, 5–5, 6–4',
      '11       2 in 36 chance     5–6, 6–5',
      '12       1 in 36 chance     6–6'
    ];
  }

  roll() {
    this.current = [DicePair._getRoll(), DicePair._getRoll()];
    this.value = this.current[0] + this.current[1];
    return this;
  }
}

module.exports = DicePair;

