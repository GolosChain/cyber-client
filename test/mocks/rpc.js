import { accounts } from '../fixtures/accounts';

export default class TestRpc {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  async get_account(accountName) {
    return await Promise.resolve(accounts[accountName]);
  }
}
