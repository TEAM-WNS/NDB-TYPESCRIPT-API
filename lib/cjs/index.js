"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NDB = void 0;
class NDB {
    constructor(url) {
        this.url = url;
        this.fetchUser = '';
    }
    init(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fetchUser = `id=${userId}&pw=${password}`;
            const res = yield fetch(`${this.url}/check?${this.fetchUser}}`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if (!('result' in res && res.result == 'exist')) {
                throw Error("계정이 없음!");
            }
        });
    }
    createUser(userId, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.url}/create?${this.fetchUser}&user=${userId}:${password}:${role}`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if ('result' in res && res.result == 'ALREADY_EXIST') {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getDataBase(dbName) {
        const database = new DataBase(this, dbName);
        return database;
    }
    createDataBase(dbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.url}/create?${this.fetchUser}&database=${dbName}&collection=Default`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return this.getDataBase(dbName);
            }
        });
    }
}
exports.NDB = NDB;
class DataBase {
    constructor(client, name) {
        this.client = client;
        this.name = name;
        if (!DataBase.hasDataBase(client, name)) {
            throw Error("null");
        }
    }
    static hasDataBase(client, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${client.url}/check?${client.fetchUser}&database=${name}&collection=Default`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if ('result' in res && res.result == 'ALREADY_EXIST') {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getCollection(name) {
        const collection = new Collection(this, name);
        return collection;
    }
    createCollection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${this.client.url}/create?${this.client.fetchUser}&database=${this.name}&collection=${name}`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return this.getCollection(name);
            }
        });
    }
}
class Collection {
    constructor(database, name) {
        this.database = database;
        this.name = name;
        if (!Collection.hasCollection(database, name)) {
            throw Error("널");
        }
        this.fetchUser = database.client.fetchUser;
        this.nameParams = `database=${database.name}&collection=${name}`;
    }
    static hasCollection(database, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${database.client.url}/check?${database.client.fetchUser}&database=${database.name}&collection=${name}`)
                .then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if ('result' in res && res.result == 'ALREADY_EXIST') {
                return true;
            }
            else {
                return false;
            }
        });
    }
    NDBfetch(input, init) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`${this.database.client.url}/collection?${this.fetchUser}&${this.nameParams}${input}`, init).then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
        });
    }
    find(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&findBy=${key}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return res;
            }
        });
    }
    edit(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&findBy=${key}&edit=${JSON.stringify(value)}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
    add(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&addKey=${key}&keyValue=${JSON.stringify(value)}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&deleteKey=${key}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
    addFieldValue(key_1, fieldName_1, fieldValue_1) {
        return __awaiter(this, arguments, void 0, function* (key, fieldName, fieldValue, isStrict = false) {
            const res = yield this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}&isStrict=${JSON.stringify(isStrict)}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
    addFieldValueIsList(key, fieldName, fieldValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
    deleteFieldValue(key, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.NDBfetch(`&findBy=${key}&deleteField=${fieldName}`);
            if ('result' in res && res.result == 'fail') {
                throw Error(res.cause);
            }
            else {
                return true;
            }
        });
    }
}
