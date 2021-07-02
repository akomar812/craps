'use strict';

class Bank {
  constructor(opts={}) {
    if (!('Models' in opts) || !('Account' in opts.Models)) {
      throw 'Bank constructor requires Account Model argument';
    }

    this.Account = opts.Models.Account;
    this.deposits = {};
  }

  async init() {
    return this.Account.findAll().then((accounts) => accounts.map(a => this.deposits[a.name] = a));
  }

  status() {
    return Object.keys(this.deposits).map(d => {
      const amt = this.deposits[d].balance;
      const high = this.deposits[d].high;
      const delta = high - amt;
      return `${d}, amount: $${amt}, high score: $${high}, distance from high: $${delta}`;
    }).join('\n');
  }

  async handleDeposit(player, amount) {
    if (!(player in this.deposits)) {
      this.deposits[player] = await this.Account.create({ name: player, balance: amount, high: amount });
    } else {
      await this.deposits[player].deposit(amount);
    }
  }

  async handleWithdrawal(player, amount) {
    if (!(player in this.deposits)) {
      throw new Error(`Player ${player} has nothing to withdraw`);
    }

    await this.deposits[player].withdraw(amount);
  }
}

module.exports = Bank;

