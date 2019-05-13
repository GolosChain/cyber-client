import Basic from './basic';

export default class Social extends Basic {
  _contractAccount = 'gls.social';
  _contractActions = ['updatemeta', 'deletemeta', 'pin', 'unpin', 'block', 'unblock', 'changereput'];
}
