import { NDBRespone } from "./types";
export declare class NDB {
    url: string;
    fetchUser: string;
    constructor(url: string);
    init(userId: string, password: string): Promise<void>;
    getDataBase(dbName: string): DataBase;
    createDataBase(dbName: string): Promise<DataBase>;
}
declare class DataBase {
    client: NDB;
    name: string;
    constructor(client: NDB, name: string);
    static hasDataBase(client: NDB, name: string): Promise<boolean>;
    getCollection(name: string): Collection;
    createCollection(name: string): Promise<Collection>;
}
declare class Collection {
    database: DataBase;
    name: string;
    nameParams: string;
    fetchUser: string;
    constructor(database: DataBase, name: string);
    static hasCollection(database: DataBase, name: string): Promise<boolean>;
    NDBfetch(input: string, init?: RequestInit): Promise<NDBRespone | object>;
    find(key: string): Promise<object>;
    edit(key: string, value: object): Promise<boolean>;
    add(key: string, value: object): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    addFieldValue(key: string, fieldName: string, fieldValue: object, isStrict?: boolean): Promise<boolean>;
    addFieldValueIsList(key: string, fieldName: string, fieldValue: object): Promise<boolean>;
    deleteFieldValue(key: string, fieldName: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=index.d.ts.map