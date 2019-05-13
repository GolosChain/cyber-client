import Basic from './basic';

export default class Emit extends Basic {
  _contractAccount = 'gls.emit';
  _contractActions = ['setparams', 'start'];

  defaults = {
    inflation: {
      start: 1500,
      stop: 95,
      narrowing: 250000,
    },
    reward_pools: {
      vesting_percent: 2400,
      ctrl_percent: 0,
      publish_percent: 6000,
    },
  };
}
