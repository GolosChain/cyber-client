import assert from 'assert';
import ecc from 'eosjs-ecc';

import { accounts } from './fixtures/accounts';

import {
  getKeyPair,
  getKeyPairByPermissionName,
  getFullKeyPairs,
  getAccountPermissions,
  getAuthType,
  convertPublicKey,
  convertKeyPair,
  generateKeys,
} from '../src/auth';

describe('auth', () => {
  it('getKeyPair', () => {
    const keyPair = getKeyPair('5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7');

    assert.deepEqual(keyPair, {
      privateKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
      publicKey: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
    });
  });

  it('getKeyPairByPermissionName', () => {
    const keyPair = getKeyPairByPermissionName(
      'alice',
      'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun',
      'posting'
    );

    assert.deepEqual(keyPair, {
      privateKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
      publicKey: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
    });
  });

  it('getFullKeyPairs', () => {
    const keyPairs = getFullKeyPairs('alice', 'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun');

    assert.deepEqual(keyPairs, {
      posting: {
        privateKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
        publicKey: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
      },
      active: {
        privateKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
        publicKey: 'GLS88rE1igQtp9vu5fwNbo7mEo3Pv976C76akACAYWwNE1zEdR2JG',
      },
      owner: {
        privateKey: '5HuBGSZqEChiM4E144KbSwcDQ69tZnLUSLsYRz2dWPEAV8XuCn5',
        publicKey: 'GLS7Cb1iawbNBHQkYUchYYKe1JLJevwCst8knqG7NwJASN4w3KNNr',
      },
    });
  });

  it('getPermissions', () => {
    const permissions = getAccountPermissions(accounts.alice.permissions);

    assert.equal(permissions.posting, 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo');
    assert.equal(permissions.active, 'GLS88rE1igQtp9vu5fwNbo7mEo3Pv976C76akACAYWwNE1zEdR2JG');
    assert.equal(permissions.owner, 'GLS7Cb1iawbNBHQkYUchYYKe1JLJevwCst8knqG7NwJASN4w3KNNr');
  });

  it('getAuthType', () => {
    const postingAuth = getAuthType(accounts.alice, 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo');

    assert.equal(postingAuth, 'posting');

    const activeAuth = getAuthType(accounts.alice, 'GLS88rE1igQtp9vu5fwNbo7mEo3Pv976C76akACAYWwNE1zEdR2JG');

    assert.equal(activeAuth, 'active');
  });

  it('convertPublicKey', () => {
    const pubKey = convertPublicKey('5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7');
    assert.equal(pubKey, 'PUB_K1_6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVERvvh');
  });

  it('convertKeyPair', () => {
    const keyPair = convertKeyPair({
      privateKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
      publicKey: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
    });
    assert.deepEqual(
      keyPair,
      new Map().set(
        'PUB_K1_6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVERvvh',
        '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7'
      )
    );
  });

  it('generateKeys by existing master key', async () => {
    const keys = await generateKeys('alice', 'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun');
    assert.deepEqual(keys, {
      master: 'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun',
      posting: {
        privateKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
        publicKey: 'GLS6qtGvXfhtNdrnk2QT5wFXvF5hmiVeMfVrqrPFuLbZigPVC4xVo',
      },
      active: {
        privateKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
        publicKey: 'GLS88rE1igQtp9vu5fwNbo7mEo3Pv976C76akACAYWwNE1zEdR2JG',
      },
      owner: {
        privateKey: '5HuBGSZqEChiM4E144KbSwcDQ69tZnLUSLsYRz2dWPEAV8XuCn5',
        publicKey: 'GLS7Cb1iawbNBHQkYUchYYKe1JLJevwCst8knqG7NwJASN4w3KNNr',
      },
    });
  });

  it('generateKeys', async () => {
    const keys = await generateKeys('bob');

    assert.equal(ecc.isValidPrivate(keys.master.substring(1)), true);

    assert.equal(ecc.isValidPrivate(keys.posting.privateKey), true);
    assert.equal(ecc.isValidPublic(keys.posting.publicKey, 'GLS'), true);

    assert.equal(ecc.isValidPrivate(keys.active.privateKey), true);
    assert.equal(ecc.isValidPublic(keys.active.publicKey, 'GLS'), true);

    assert.equal(ecc.isValidPrivate(keys.owner.privateKey), true);
    assert.equal(ecc.isValidPublic(keys.owner.publicKey, 'GLS'), true);
  });
});
