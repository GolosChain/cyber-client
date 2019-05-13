import Basic from './basic';

export default class Ctrl extends Basic {
  _contractAccount = 'gls.ctrl';
  _contractActions = ['setparams', 'regwitness', 'unregwitness', 'votewitness', 'unvotewitn'];

  defaults = {
    max_witnesses: 5,
    max_witness_votes: 30,
    multisig_perms: {
      super_majority: 0,
      majority: 0,
      minority: 0,
    },
  };

}
