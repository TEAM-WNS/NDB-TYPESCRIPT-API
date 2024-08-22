import { NDBRespone } from "./types";

export class NDB {
    fetchUser: string;

    constructor(public url: string, private userId: string, private password: string) {
        // login check
        this.fetchUser = `id=${userId}&pw=${password}`;
    }

    public getDataBase(dbName: string): DataBase {
        const database = new DataBase(this, dbName);
        return database
    }

    public async createDataBase(dbName: string, collectionName: string): Promise<DataBase> {
        // fetch
        const r = await fetch(`${this.url}/create?${this.fetchUser}&database=${dbName}&collection=${collectionName}`)
        // throw error
        return this.getDataBase(dbName);
    }
}

class DataBase {

    constructor(public client: NDB, public name: string) {
        if (!DataBase.hasDataBase(client, name)) {
            throw Error("null");
        }
    }

    public static hasDataBase(client: NDB, name: string): boolean {
        // has check
        return false;
    }

    public getCollection(name: string): Collection {
        const collection = new Collection(this, name);
        return collection;
    }

    public createCollection(name: string): Collection {
        // fetch
        
        return this.getCollection(name);
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

    public static hasCollection(database: DataBase, name: string): boolean {
        // has check
        return false;
    }

    public async NDBfetch(input: string, init?: RequestInit): Promise<NDBRespone | object> {
        return await fetch(`${this.database.client.url}/collection?${this.fetchUser}&${this.nameParams}${input}`, init).then(async res => await res.json());
    }

    public async findBy(key: string) {
        const res = await this.NDBfetch(`&findBy=${key}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return res as object;
        }
    }

    public async editValue(key: string, value: object) {
        const res = await this.NDBfetch(`&findBy=${key}&edit=${JSON.stringify(value)}`);
        if ('result' in res && res.result == 'fail') {
            throw Error(res.cause);
        } else {
            return true;
        }
    }

    public setStrict(key: string, value: boolean) {

    }

    public addKey(key: string, value: object) {

    }

    public deleteKey(key: string) {

    }
}