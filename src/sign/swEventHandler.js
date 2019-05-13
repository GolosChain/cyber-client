import ecc from 'eosjs-ecc';

import { SET_KEYS, GET_AVAILABLE_KEYS, SIGN } from './eventTypes';

async function getStoredAuth() {
  return new Map(await self.IDBManager.get('auth'));
}

async function setKeys({ keyPairs }) {
  const keys = new Map();
  const availableKeys = [];

  for (const [pubKey, privKey] of keyPairs) {
    keys.set(pubKey, privKey);
    availableKeys.push(pubKey);
  }

  await self.IDBManager.set('auth', Array.from(keys));
  await self.IDBManager.set('availableKeys', availableKeys);

  return availableKeys;
}

async function getAvailableKeys() {
  const keys = await self.IDBManager.get('availableKeys');
  return keys || [];
}

async function signTransaction({ chainId, requiredKeys, serializedTransaction }) {
  const signBuf = Buffer.concat([
    new Buffer(chainId, 'hex'),
    new Buffer(serializedTransaction),
    new Buffer(new Uint8Array(32)),
  ]);

  const keys = await getStoredAuth();

  const signatures = requiredKeys.map(pub => ecc.Signature.sign(signBuf, keys.get(pub)));
  return { signatures: [signatures.toString()], serializedTransaction };
}

async function getResponse({ type, payload }) {
  switch (type) {
    case SET_KEYS:
      return await setKeys(payload);
    case GET_AVAILABLE_KEYS:
      return await getAvailableKeys();
    case SIGN:
      return await signTransaction(payload);
  }
}

const eventHandler = event => {
  const sendResponse = r => event.ports[0].postMessage(r);

  getResponse(event.data).then(response => sendResponse(response));
};

export default eventHandler;
