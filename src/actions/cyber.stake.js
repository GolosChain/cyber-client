import Basic from './basic';

export default class CyberStake extends Basic {
  _contractAccount = 'cyber.stake';
  _contractActions = [
    'create',
    'open',
    'enable',
    'delegatevote',
    'setgrntterms',
    'recallvote',
    'withdraw',
    'setproxylvl',
    'setproxyfee',
    'setminstaked',
    'setkey',
    'updatefunds',
    'reward',
    'pick',
    'delegateuse',
    'recalluse',
    'claim',
  ];
}
