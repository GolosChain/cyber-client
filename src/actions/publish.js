import Basic, { BLOCKS_BEHIND } from './basic';

const fixpMax = 2251799813685247;
const golosCurationFuncStr = `${fixpMax} / ((4000000000000 / max(x, 0.1)) + 1)`;

export default class Publish extends Basic {
  _contractAccount = 'gls.publish';
  _contractActions = [
    'createmssg',
    'updatemssg',
    'deletemssg',
    'upvote',
    'downvote',
    'unvote',
    'closemssg',
    'createacc',
    'setrules',
    'setlimit',
    'setparams',
    'reblog',
    'erasereblog',
  ];

  defaults = {
    max_vote_changes: 5,
    max_beneficiaries: 64,
    max_comment_depth: 127,
    cashout_window: {
      window: 120,
      upvote_lockout: 15,
    },
    mainfunc: { str: 'x', maxarg: fixpMax },
    curationfunc: {
      str: golosCurationFuncStr,
      maxarg: fixpMax,
    },
    timepenalty: { str: 'x/1800', maxarg: 1800 },
    curatorsprop: 2500,
    maxtokenprop: 5000,
  };

  getDefaultLimits() {
    const limits = {};
    for (const key of ['post', 'comment', 'vote', 'post bandwidth']) {
      limits[key] = { charge_id: 0, price: -1, cutoff: 0, vesting_price: 0, min_vesting: 0 };
    }
    return limits;
  }

  async _getBlockNum() {
    const info = await this.api.rpc.get_info();
    const refBlock = await this.api.rpc.get_block(info.head_block_num - BLOCKS_BEHIND);
    return refBlock.block_num & 0xffff;
  }

  async createMessage(contractAccount, actor, data, options) {
    if (typeof contractAccount !== 'string') {
      // createMessage(actor, data, options)
      [actor, data, options] = arguments;
      contractAccount = this._contractAccount;
    }

    // add ref_block_num to message_id
    data = {
      ...data,
      message_id: {
        ...data.message_id,
        ref_block_num: await this._getBlockNum(),
      },
    };

    return this.createmssg(contractAccount, actor, data, options);
  }
}
