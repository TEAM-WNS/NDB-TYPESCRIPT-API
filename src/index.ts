import { NDBRespone, Role } from "./types";

export class NDB {
    fetchUser: string = '';

    constructor(public url: string) {
    }

    public async init(userId: string, password: string) {
        this.fetchUser = `id=${userId}&pw=${password}`;
        const res = await fetch(`${this.url}/check?${this.fetchUser}}`)
            .then(async res => await res.json()) as NDBRespone;
        if (!('result' in res && res.result == 'exist')) {
            throw Error("계정이 없음!");
        }
    }

    public async createUser(userId: string, password: string, role: Role) {
        const res = await fetch(`${this.url}/create?${this.fetchUser}&user=${userId}:${password}:${role}`)
            .then(async res => await res.json());
        if ('result' in res && res.result == 'ALREADY_EXIST') {
            return true;
        } else {
            return false;
        }
    }

    public getDataBase(dbName: string): DataBase {
        const database = new DataBase(this, dbName);
        return database
    }

    public async createDataBase(dbName: string): Promise<DataBase> {
        const res = await fetch(`${this.url}/create?${this.fetchUser}&database=${dbName}&collection=Default`)
            .then(async res => await res.json()) as NDBRespone;
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return this.getDataBase(dbName);
        }
    }
}

class DataBase {

    constructor(public client: NDB, public name: string) {
        if (!DataBase.hasDataBase(client, name)) {
            throw Error("null");
        }
    }

    public static async hasDataBase(client: NDB, name: string): Promise<boolean> {
        const res = await fetch(`${client.url}/check?${client.fetchUser}&database=${name}&collection=Default`)
            .then(async res => await res.json()) as NDBRespone;
        if ('result' in res && res.result == 'ALREADY_EXIST') {
            return true;
        } else {
            return false;
        }
    }

    public getCollection(name: string): Collection {
        const collection = new Collection(this, name);
        return collection;
    }

    public async createCollection(name: string): Promise<Collection> {
        const res = await fetch(`${this.client.url}/create?${this.client.fetchUser}&database=${this.name}&collection=${name}`)
            .then(async res => await res.json()) as NDBRespone;
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return this.getCollection(name);
        }

    }
}

class Collection {
    nameParams: string;
    fetchUser: string;

    constructor(public database: DataBase, public name: string) {
        if (!Collection.hasCollection(database, name)) {
            throw Error("널");
        }
        this.fetchUser = database.client.fetchUser;
        this.nameParams = `database=${database.name}&collection=${name}`;
    }

    public static async hasCollection(database: DataBase, name: string): Promise<boolean> {
        const res = await fetch(`${database.client.url}/check?${database.client.fetchUser}&database=${database.name}&collection=${name}`)
            .then(async res => await res.json()) as NDBRespone;
        if ('result' in res && res.result == 'ALREADY_EXIST') {
            return true;
        } else {
            return false;
        }
    }

    public async NDBfetch(input: string, init?: RequestInit): Promise<NDBRespone | object> {
        return await fetch(`${this.database.client.url}/collection?${this.fetchUser}&${this.nameParams}${input}`, init).then(async res => await res.json());
    }

    public async find(key: string) {
        const res = await this.NDBfetch(`&findBy=${key}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return res as object;
        }
    }

    public async edit(key: string, value: object) {
        const res = await this.NDBfetch(`&findBy=${key}&edit=${JSON.stringify(value)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public async add(key: string, value: object) {
        const res = await this.NDBfetch(`&addKey=${key}&keyValue=${JSON.stringify(value)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public async delete(key: string) {
        const res = await this.NDBfetch(`&deleteKey=${key}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public async addFieldValue(key: string, fieldName: string, fieldValue: object, isStrict: boolean = false) {
        const res = await this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}&isStrict=${JSON.stringify(isStrict)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public async addFieldValueIsList(key: string, fieldName: string, fieldValue: object) {
        const res = await this.NDBfetch(`&findBy=${key}&addField=${fieldName}&fieldValue=${fieldValue}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public async deleteFieldValue(key: string, fieldName: string) {
        const res = await this.NDBfetch(`&findBy=${key}&deleteField=${fieldName}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }


}