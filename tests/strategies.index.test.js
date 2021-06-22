'use strict';
const Strategy = require('../strategies');

test('strategy interface', () => {
  const strategy = new Strategy();
  const spyBefore = jest.spyOn(strategy, 'beforeRoll').mockImplementation();
  const spyAfter = jest.spyOn(strategy, 'afterRoll').mockImplementation();

  strategy.beforeRoll();
  strategy.afterRoll();

  expect(strategy.debug).toBe(false);
  expect(spyBefore).toHaveBeenCalledTimes(1);
  expect(spyAfter).toHaveBeenCalledTimes(1);

  const strategy1 = new Strategy({ debug: true });
  const spy1Before = jest.spyOn(strategy, 'beforeRoll').mockImplementation();
  const spy1After = jest.spyOn(strategy, 'afterRoll').mockImplementation();

  strategy1.beforeRoll();
  strategy1.afterRoll();
  expect(spy1Before).toHaveBeenCalledTimes(1);
  expect(spy1After).toHaveBeenCalledTimes(1);

  expect(strategy1.debug).toBe(true);
});
