export class NDB {
    url;
    fetchUser = '';
    constructor(url) {
        this.url = url;
    }
    async init(userId, password) {
        this.fetchUser = `id=${userId}&pw=${password}`;
        const res = await fetch(`${this.url}/check?${this.fetchUser}}`)
            .then(async (res) => await res.json());
        if (!('result' in res && res.result == 'exist')) {
            throw Error("계정이 없음!");
        }
    }
    getDataBase(dbName) {
        const database = new DataBase(this, dbName);
        return database;
    }
    async createDataBase(dbName) {
        const res = await fetch(`${this.url}/create?${this.fetchUser}&database=${dbName}&collection=Default`)
            .then(async (res) => await res.json());
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return this.getDataBase(dbName);
        }
    }
}
class DataBase {
    client;
    name;
    constructor(client, name) {
        this.client = client;
        this.name = name;
        if (!DataBase.hasDataBase(client, name)) {
            throw Error("null");
        }
    }
    static async hasDataBase(client, name) {
        const res = await fetch(`${client.url}/check?${client.fetchUser}&database=${name}&collection=Default`)
            .then(async (res) => await res.json());
        if ('result' in res && res.result == 'ALREADY_EXIST') {
            return true;
        }
        else {
            return false;
        }
    }
    getCollection(name) {
        const collection = new Collection(this, name);
        return collection;
    }
    async createCollection(name) {
        const res = await fetch(`${this.client.url}/create?${this.client.fetchUser}&database=${this.name}&collection=${name}`)
            .then(async (res) => await res.json());
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return this.getCollection(name);
        }
    }
}
class Collection {
    database;
    name;
    nameParams;
    fetchUser;
    constructor(database, name) {
        this.database = database;
        this.name = name;
        if (!Collection.hasCollection(database, name)) {
            throw Error("널");
        }
        this.fetchUser = database.client.fetchUser;
        this.nameParams = `database=${database.name}&collection=${name}`;
    }
    static async hasCollection(database, name) {
        const res = await fetch(`${database.client.url}/check?${database.client.fetchUser}&database=${database.name}&collection=${name}`)
            .then(async (res) => await res.json());
        if ('result' in res && res.result == 'ALREADY_EXIST') {
            return true;
        }
        else {
            return false;
        }
    }
    async NDBfetch(input, init) {
        return await fetch(`${this.database.client.url}/collection?${this.fetchUser}&${this.nameParams}${input}`, init).then(async (res) => await res.json());
    }
    async find(key) {
        const res = await this.NDBfetch(`&findBy=${key}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return res;
        }
    }
    async edit(key, value) {
        const res = await this.NDBfetch(`&findBy=${key}&edit=${JSON.stringify(value)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
    async add(key, value) {
        const res = await this.NDBfetch(`&addKey=${key}&keyValue=${JSON.stringify(value)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
    async delete(key) {
        const res = await this.NDBfetch(`&deleteKey=${key}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
    async addFieldValue(key, fieldName, fieldValue, isStrict = false) {
        const res = await this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}&isStrict=${JSON.stringify(isStrict)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
    async addFieldValueIsList(key, fieldName, fieldValue) {
        const res = await this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
    async deleteFieldValue(key, fieldName) {
        const res = await this.NDBfetch(`&findBy=${key}&deleteField=${fieldName}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        }
        else {
            return true;
        }
    }
}
