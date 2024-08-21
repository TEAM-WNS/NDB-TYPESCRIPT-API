
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
        if (DataBase.hasDataBase(client, name)) {
            return new DataBase(client, name);
        } else {
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

    constructor(public database: DataBase, public name: string) {
        if (Collection.hasCollection(database, name)) {
            return new Collection(database, name);
        } else {
            throw Error("널");
        }
    }

    public static hasCollection(database: DataBase, name: string): boolean {
        // has check
        return false;
    }

    public findBy(key: string) {

    }

    public editValue(key: string, value: object) {

    }

    public setStrict(key: string, value: boolean) {

    }

    public addKey(key: string, value: object) {

    }

    public deleteKey(key: string) {

    }
}