import { Api, JsonRpc } from 'cyberwayjs';
import ecc from 'eosjs-ecc';
import fetch from 'node-fetch'; // node only; not needed in browsers
import JsSignatureProvider from 'cyberwayjs/dist/eosjs-jssig';
import { TextEncoder, TextDecoder } from 'text-encoding'; // node only; native TextEncoder/Decoder

import {
  authTypes,
  getKeyPair,
  getKeyPairByPermissionName,
  getAuthType,
  convertPublicKey,
  getKeyPairFromPrivateOrMaster,
} from './auth';

import Actions from './actions';

export default class CyberGolos {
  constructor(args) {
    this.rpc = args.rpc || new JsonRpc(args.endpoint, { fetch });
    this.signatureProvider = null;

    for (const action of Object.keys(Actions)) {
      this[action] = new Actions[action]();
    }
  }

  /**
   * @deprecated
   */
  async accountAuth(accountName, privateKey) {
    const accountData = await this.rpc.get_account(accountName);

    if (!accountData) {
      throw new Error('Account not found');
    }

    let keyPair = {};
    try {
      keyPair = getKeyPair(privateKey);
    } catch (err) {
      keyPair = getKeyPairByPermissionName(accountName, privateKey, 'active');
    }

    const authType = getAuthType(accountData, keyPair.publicKey);

    if (!authTypes.includes(authType)) {
      throw new Error('Missing required accounts');
    }

    const publicKey = convertPublicKey(privateKey);

    this.signatureProvider = new JsSignatureProvider([keyPair.privateKey]);

    this.initApi(this.signatureProvider);

    return {
      accountName,
      authType,
      publicKey,
    };
  }

  /**
   * @deprecated
   */
  async autoAccountAuth(accountName, publicKey) {
    this.signatureProvider = new SWSignatureProvider();
    const keys = await this.signatureProvider.getAvailableKeys();

    if (!keys || !keys.includes(publicKey)) {
      return;
    }

    this.initApi(this.signatureProvider);

    return {
      accountName,
      publicKey,
    };
  }

  getActualAuth(accountName, privateKey, keyRole) {
    const normalizedName = accountName
      .trim()
      .toLowerCase()
      .replace(/@.*$/, '');

    privateKey = privateKey.trim();

    /* 
    if (/^P/.test(privateKey) && !ecc.isValidPrivate(privateKey.substring(1))) {
      throw new Error('Invalid master key');
    }

    if (!/^P/.test(privateKey) && !ecc.isValidPrivate(privateKey)) {
      throw new Error('Invalid private key');
    }
    */

    const keys = getKeyPairFromPrivateOrMaster(normalizedName, privateKey, keyRole);

    return {
      accountName: normalizedName,
      actualKey: keys.privateKey,
      publicKey: keys.publicKey,
    };
  }

  initProvider(privateKey) {
    this.initApi(new JsSignatureProvider(Array.isArray(privateKey) ? privateKey : [privateKey]));
  }

  initApi(signatureProvider) {
    this.signatureProvider = signatureProvider;
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    for (const action of Object.keys(Actions)) {
      this[action].setApi(this.api);
    }
  }
}
