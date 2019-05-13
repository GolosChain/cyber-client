import { base64ToBinary } from 'cyberwayjs/dist/eosjs-numeric';

import Basic from './basic';

export default class Cyber extends Basic {
  _contractAccount = 'cyber';
  _contractActions = ['newaccount', 'updateauth', 'setcode', 'setabi'];

  createAccount(actor, { name, activePubkey, ownerPubkey }, options) {
    return this.newaccount(
      actor,
      {
        creator: this._contractAccount,
        name,
        owner: {
          threshold: 1,
          keys: [{ key: ownerPubkey, weight: 1 }],
          accounts: [],
          waits: [],
        },
        active: {
          threshold: 1,
          keys: [{ key: activePubkey, weight: 1 }],
          accounts: [],
          waits: [],
        },
      },
      options
    );
  }

  async deployContract(actor, { wasm, abi }, options) {
    const [setcodeAction] = await this.setcode(
      actor,
      {
        account: actor.accountName,
        vmtype: 0,
        vmversion: 0,
        code: wasm,
      },
      { broadcast: false }
    );

    const [setabiAction] = await this.setabi(
      actor,
      {
        account: actor.accountName,
        abi,
      },
      { broadcast: false }
    );

    return this.sendTransaction([setcodeAction, setabiAction], { ...options, broadcast: true });
  }

  async cloneContract(actor, { fromContract }, options) {
    const { abi, wasm } = await this.api.rpc.get_raw_code_and_abi(fromContract);

    return this.deployContract(
      actor,
      {
        wasm: Buffer.from(base64ToBinary(wasm)).toString('hex'),
        abi: Buffer.from(base64ToBinary(abi)).toString('hex'),
      },
      options
    );
  }
}
