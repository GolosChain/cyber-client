import { openDb } from 'idb';

export default class IDBmanager {
  constructor(dbName) {
    this.dbName = dbName;
    this.dbStoreName = `${dbName}Store`;
  }

  getDBPromise() {
    return openDb(this.dbName, 1, upgradeDB => {
      upgradeDB.createObjectStore(this.dbStoreName);
    });
  }

  async get(key) {
    const db = await this.getDBPromise();
    return db
      .transaction(this.dbStoreName)
      .objectStore(this.dbStoreName)
      .get(key);
  }

  async set(key, val) {
    const db = await this.getDBPromise();
    const tx = db
      .transaction(this.dbStoreName, 'readwrite')
      .objectStore(this.dbStoreName)
      .put(val, key);
    return tx.complete;
  }

  async delete(key) {
    const db = await this.getDBPromise();
    const tx = db
      .transaction(this.dbStoreName, 'readwrite')
      .objectStore(this.dbStoreName)
      .delete(key);
    return tx.complete;
  }
}
