export interface IRepository<T> {
    del: (uid: string) => Promise<T>;
    get: (uid: string) => Promise<T>;
    getList: (params: any) => Promise<T[]>;
    save: (item: T, params?: any) => Promise<T>;
}
