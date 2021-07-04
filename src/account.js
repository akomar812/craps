'use strict';
const { DataTypes, Model } = require('sequelize');

const validate = (amount) => {
  if (amount < 0) {
    throw new Error('Transaction amount can\'t be negative');
  }
};

module.exports = (db) => {
  class Account extends Model {
    async deposit(amount) {
      validate(amount);
  
      this.balance += amount;
  
      if (this.balance > this.high) {
        this.high = this.balance;
      }

      await this.save();
      return this;
    }
  
    async withdraw(amount) {
      validate(amount);
  
      if (amount > this.balance) {
        throw new Error(`Withdrawal amount $${amount} is more than you have deposited $${this.balance}`);
      }
  
      this.balance -= amount;
      await this.save();
      return this;
    }
  }

  Account.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    high: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize: db,
    modelName: 'Account'
  });

  return Account;
};