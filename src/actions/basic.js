export const BLOCKS_BEHIND = 3;
export const EXPIRE_SECONDS = 30;

export default class BasicApi {
  constructor() {
    this.api = undefined;
  }

  setApi(api) {
    this.api = api;

    if (!this._contractActions) {
      return;
    }

    for (const action of this._contractActions) {
      this[action] = function(contractAccount, actor, data, options) {
        if (typeof contractAccount !== 'string') {
          // action(actor, data, options)
          [actor, data, options] = arguments;
          contractAccount = this._contractAccount;
        }
        return this._transaction(contractAccount, action, actor, data, options);
      };
    }
  }

  _verifyActor({ accountName } = {}) {
    if (!accountName) {
      throw new Error('Parameter "actor" should be an object with a field "accountName"');
    }
  }

  _verifyApi() {
    if (!this.api) {
      throw new Error('API is not initialized');
    }
  }

  _verifyContractAccount(contractAccount) {
    if (!contractAccount) {
      throw new Error('Property "contractAccount" should be set');
    }
  }

  _validateTransactionOptions(contractAccount, actionName, actor, data) {
    this._verifyContractAccount(contractAccount);
    this._verifyApi();
    this._verifyActor(actor);
  }

  prepareAction(contractAccount, actionName, actor, data) {
    return {
      account: contractAccount,
      name: actionName,
      authorization: [{ actor: actor.accountName, permission: actor.permission || 'active' }],
      data,
    };
  }

  _transaction = async (contractAccount, actionName, actor, data, { providebw = false, broadcast = true } = {}) => {
    this._validateTransactionOptions(contractAccount, actionName, actor, data);

    const actions = [this.prepareAction(contractAccount, actionName, actor, data)];

    if (providebw) {
      actions.push(
        this.prepareAction(
          'cyber',
          'providebw',
          { accountName: 'cyber' },
          {
            provider: 'cyber',
            account: actor.accountName,
          }
        )
      );
    }

    if (broadcast || providebw) {
      return await this.transact(actions, { providebw, broadcast });
    }

    return actions;
  };

  async transact(actions, options) {
    return await this.api.transact(
      { actions },
      {
        ...options,
        blocksBehind: BLOCKS_BEHIND,
        expireSeconds: EXPIRE_SECONDS,
      }
    );
  }

  sendActions(_, actions, options) {
    return this.transact(actions, options);
  }
}
