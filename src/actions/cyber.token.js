import Basic from './basic';

export default class CyberToken extends Basic {
  _contractAccount = 'cyber.token';
  _contractActions = ['transfer', 'create', 'issue', 'open'];
}
