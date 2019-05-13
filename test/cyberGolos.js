import assert from 'assert';

import CyberGolos from '../src/CyberGolos';
import TestRpc from './mocks/rpc';

const getInstance = () => {
  return new CyberGolos({
    endpoint: 'endpoint.test',
    rpc: new TestRpc(),
  });
};

describe('CyberGolos', () => {
  it('should auth with private active key', async function() {
    const result = await getInstance().getActualAuth('alice', '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB');

    assert.deepEqual(result, {
      accountName: 'alice',
      actualKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
    });
  });

  it('should auth with private active key with whitespace', async function() {
    const result = await getInstance().getActualAuth('alice', '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB ');

    assert.deepEqual(result, {
      accountName: 'alice',
      actualKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
    });
  });

  it('should auth with private active key and golos account', async function() {
    const result = await getInstance().getActualAuth(
      'Alice@golos',
      '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB'
    );

    assert.deepEqual(result, {
      accountName: 'alice',
      actualKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
    });
  });

  it('should auth with master key', async function() {
    const result = await getInstance().getActualAuth('alice', 'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun');

    assert.deepEqual(result, {
      accountName: 'alice',
      actualKey: '5JV8Q8CWPLCRsxAsGudhZXfJrKq2dnCLXzAmr5pbFAMMbiJ44UB',
    });
  });

  it('should auth with master key and posting role', async function() {
    const result = await getInstance().getActualAuth(
      'alice',
      'P5KTcRDPA24Tj4w4aLydA2swLjL5btzSQiAJBNoywn4FS3yJ4gun',
      'posting'
    );

    assert.deepEqual(result, {
      accountName: 'alice',
      actualKey: '5KBJAs6FX3ebwRCfM7Ej3ydHM9a7fT6bCMWKJjsAWro9gJn7Kk7',
    });
  });

  it('should throw an error if master key is invalid', async function() {
    try {
      await getInstance().getActualAuth('alice', 'P_some_master_key');
      assert(false, 'should not be reached');
    } catch (err) {
      assert.equal(err.message, 'Invalid master key');
    }
  });

  it('should throw an error if private key is invalid', async function() {
    try {
      await getInstance().getActualAuth('alice', 'some_private_key');
      assert(false, 'should not be reached');
    } catch (err) {
      assert.equal(err.message, 'Invalid private key');
    }
  });

  it('should throw an error if private key is invalid', async function() {
    try {
      await getInstance().getActualAuth('alice', '5JV8Q8CWPLCRsxAsGudhZXfJrKqnCLXzAmr5pbFAMMbiJ44U');
      assert(false, 'should not be reached');
    } catch (err) {
      assert.equal(err.message, 'Invalid private key');
    }
  });
});
