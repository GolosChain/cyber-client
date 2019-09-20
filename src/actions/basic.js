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
      this[actionName] = function(contractAccount, auth, data, options) {
        if (typeof contractAccount !== 'string') {
          // action(actor, data, options)
          [auth, data, options] = arguments;
          contractAccount = this._contractAccount;
        }
        return this._transaction(
          [
            {
              contractAccount,
              actionName,
              auth,
              data,
            },
          ],
          options
        );
      };
    }
  }

  _verifyAuth(authList) {
    if (authList.length === 0) {
      throw new Error('Empty "auth" parameter');
    }

    for (const { actor, accountName } of authList) {
      if (!actor && !accountName) {
        throw new Error('Item in "auth" should be an object with a field "actor"');
      }
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

  _validateTransactionOptions(contractAccount, actionName, authList, data) {
    this._verifyContractAccount(contractAccount);
    this._verifyApi();
    this._verifyAuth(authList);
  }

  prepareAction(contractAccount, actionName, authList, data) {
    return {
      account: contractAccount,
      name: actionName,
      authorization: authList,
      data,
    };
  }

  _transaction = async (
    actions,
    {
      broadcast = true,
      msig = false,
      msigExpires = 600,
      provideBandwidthFor = null,
      bandwidthProvider = 'cyber',
      delaySec = 0,
      signByActors = null,
    } = {}
  ) => {
    const preparedActions = actions.map(({ contractAccount, actionName, auth, data }) => {
      const authList = this._normalizeAuth(auth);

      this._validateTransactionOptions(contractAccount, actionName, authList, data);

      return this.prepareAction(contractAccount, actionName, authList, data);
    });

    if (msig) {
      return {
        ...(await this._makeTransactionHeader({ expires: msigExpires, delaySec })),
        actions: await this.api.serializeActions(preparedActions),
      };
    }

    if (provideBandwidthFor) {
      const list = Array.isArray(provideBandwidthFor) ? provideBandwidthFor : [provideBandwidthFor];

      for (const account of list) {
        preparedActions.push(
          this.prepareAction(
            'cyber',
            'providebw',
            [
              {
                actor: bandwidthProvider,
                permission: 'providebw',
              },
            ],
            {
              provider: bandwidthProvider,
              account,
            }
          )
        );
      }
    }

    if (!broadcast && !provideBandwidthFor) {
      return preparedActions;
    }

    return await this.transact(
      { actions: preparedActions, delay_sec: delaySec },
      { providebw: Boolean(provideBandwidthFor), broadcast, signByActors }
    );
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

  _normalizeAuth(auth) {
    if (!auth) {
      return [];
    }

    let authList = auth;

    if (!Array.isArray(auth)) {
      authList = [auth];
    }

    return authList.map(({ actor, accountName, permission }) => ({
      actor: actor || accountName,
      permission: permission || 'active',
    }));
  }

  executeActions(_, actions, options) {
    return this._transaction(actions, options);
  }
}
