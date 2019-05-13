import { SET_KEYS, GET_AVAILABLE_KEYS, SIGN } from './eventTypes';
import { sendMessage } from './utils';

export default class SWSignatureProvider {
  setKeyPairs(keyPairs) {
    sendMessage({
      type: SET_KEYS,
      payload: { keyPairs },
    });
  }

  async getAvailableKeys() {
    return await sendMessage({
      type: GET_AVAILABLE_KEYS,
      payload: {},
    });
  }

  async sign({ chainId, requiredKeys, serializedTransaction }) {
    return await sendMessage({
      type: SIGN,
      payload: {
        chainId,
        requiredKeys,
        serializedTransaction,
      },
    });
  }
}
