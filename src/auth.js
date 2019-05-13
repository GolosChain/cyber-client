import ecc from 'eosjs-ecc';
import { convertLegacyPublicKey } from 'cyberwayjs/dist/eosjs-numeric';

export const authTypes = ['posting', 'active', 'owner'];

export function getKeyPair(privateKey) {
  const publicKey = ecc.privateToPublic(privateKey, 'GLS');

  return {
    privateKey,
    publicKey,
  };
}

export function fromSeed(accountName, masterKey, permName) {
  return ecc.seedPrivate(`${accountName}${permName}${masterKey}`);
}

export function getKeyPairByPermissionName(accountName, masterKey, permName) {
  const privateKey = fromSeed(accountName, masterKey, permName);
  const publicKey = ecc.privateToPublic(privateKey, 'GLS');

  return {
    privateKey,
    publicKey,
  };
}

export function getFullKeyPairs(accountName, masterKey) {
  const keyPairs = {};

  for (const permName of authTypes) {
    keyPairs[permName] = getKeyPairByPermissionName(accountName, masterKey, permName);
  }

  return keyPairs;
}

export function getKeyPairFromPrivateOrMaster(accountName, privateKey, keyRole = 'active') {
  let keys = {};
  try {
    keys = getKeyPair(privateKey);
  } catch (err) {
    keys = getKeyPairByPermissionName(accountName, privateKey, keyRole);
  }
  return keys;
}

export function getAccountPermissions(permissions) {
  const keys = {};

  for (const perm of permissions) {
    keys[perm.perm_name] = perm.required_auth.keys[0].key;
  }

  return keys;
}

export function getAuthType(account, publicKey) {
  const accountPerms = getAccountPermissions(account.permissions);

  for (const perm of Object.keys(accountPerms)) {
    if (accountPerms[perm] === publicKey) {
      return perm;
    }
  }
}

export function convertPublicKey(privateKey) {
  return convertLegacyPublicKey(
    ecc.PrivateKey.fromString(privateKey)
      .toPublic()
      .toString('GLS')
  );
}

export function convertKeyPair(keyPair) {
  return new Map().set(convertPublicKey(keyPair.privateKey), keyPair.privateKey);
}

export function sign(data, privateKey) {
  return ecc.Signature.sign(data, privateKey).toString();
}

export async function generateKeys(accountName, password) {
  const master = password || `P${await ecc.randomKey()}`;

  return {
    master,
    ...getFullKeyPairs(accountName, master),
  };
}
