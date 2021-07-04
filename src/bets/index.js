'use strict';

/**
 * Interface for standard craps bets. Individual bet types should implement
 * this interface and this isn't meant to be instantiated directly
 */
class Bet {
  constructor(opts={}) {
    if (['prop', 'multi'].indexOf(opts.type) < 0) {
      throw new Error('Invalid bet type: '+opts.type);
    }

    if (opts.houseEdge < 0 || opts.houseEdge >= 100) {
      throw new Error('House edge must be in range [0 and 100)');
    }

    this.type = opts.type;
    this.houseEdge = opts.houseEdge;
    this.payout = opts.payout;
    this.sticky = opts.sticky || false;
  }

  /**
   * All implementations should override this function
   */
  evaluate() {
    console.warn('Bet evaluate method is meant to be overridden by a class which implements this interface');
  }

  /**
   * Override this method if you need to place conditions on when a bet can be made
   */
  isAllowingWagers() {
    return true;
  }
}

module.exports.Bet = Bet;


