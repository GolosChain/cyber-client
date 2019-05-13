import Basic from './basic';

export default class Vesting extends Basic {
  _contractAccount = 'gls.vesting';
  _contractActions = [
    'createvest',
    'retire',
    'unlocklimit',
    'open',
    'close',
    'setparams',
    'withdraw',
    'stopwithdraw',
    'delegate',
    'undelegate',
  ];
}
