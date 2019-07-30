import Basic from './basic';

export default class CyberToken extends Basic {
  _contractAccount = 'cyber.token';
  _contractActions = [
    'create',
    'issue',
    'transfer',
    'bulktransfer',
    'payment',
    'bulkpayment',
    'claim',
    'open',
    'close',
    'retire',
  ];
}
