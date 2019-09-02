import { Serialize } from 'cyberwayjs';

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

    for (const actionName of this._contractActions) {
      this[actionName] = function(contractAccount, actor, data, options) {
        if (typeof contractAccount !== 'string') {
          // action(actor, data, options)
          [actor, data, options] = arguments;
          contractAccount = this._contractAccount;
        }
        return this._transaction(
          [
            {
              contractAccount,
              actionName,
              actor,
              data,
            },
          ],
          options
        );
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

  _transaction = async (
    actions,
    { broadcast = true, msig = false, msigExpires = 600, providebw = false, bwprovider = 'cyber', delaySec = 0 } = {}
  ) => {
    const preparedActions = actions.map(({ contractAccount, actionName, actor, data }) => {
      this._validateTransactionOptions(contractAccount, actionName, actor, data);

      return this.prepareAction(contractAccount, actionName, actor, data);
    });

    if (msig) {
      return {
        ...(await this._makeTransactionHeader({ expires: msigExpires, delaySec })),
        actions: await this.api.serializeActions(preparedActions),
      };
    }

    if (providebw) {
      preparedActions.push(
        this.prepareAction(
          'cyber',
          'providebw',
          { accountName: bwprovider, permission: 'providebw' },
          {
            provider: bwprovider,
            account: actions[0].actor.accountName,
          }
        )
      );
    }

    if (broadcast || providebw) {
      return await this.transact({ actions: preparedActions, delay_sec: delaySec }, { providebw, broadcast });
    }

    return preparedActions;
  };

  async transact(trx, options) {
    return await this.api.transact(trx, {
      ...options,
      blocksBehind: BLOCKS_BEHIND,
      expireSeconds: EXPIRE_SECONDS,
    });
  }

  async _makeTransactionHeader({ expires, delaySec }) {
    const info = await this.api.rpc.get_info();
    const refBlock = await this.api.rpc.get_block(info.head_block_num - BLOCKS_BEHIND);

    return {
      ...this.api.getDefaultTransactionHeader(),
      ...Serialize.transactionHeader(refBlock, expires),
      delay_sec: delaySec,
    };
  }

  executeActions(_, actions, options) {
    return this._transaction(actions, options);
  }
}
