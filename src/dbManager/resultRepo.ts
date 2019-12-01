import { db } from './firebaseConfig';
import { IRepository } from './repoTypes';
import { Result } from 'als-models';
import { IResultData } from 'als-data-types/result';

const resultRef = db.collection('result');

interface IGameRepo extends IRepository<Result> {
    get: (uid: string) => Promise<Result>;
}

export const resultRepo: IGameRepo = {
    get,
    save,
    getList,
    del,
};

function get(uid: string) {
    console.log('get result from firebase')
    return resultRef
        .doc(uid)
        .get()
        .then(doc => {
            if (doc.exists) {
                return Promise.resolve(new Result(doc.id, doc.data() as IResultData));
            } else {
                return Promise.reject('Not found');
            }
        });
}

function save(item: Result) {
    return resultRef
        .doc(item.uid)
        .set(item.toJson())
        .then(() => {
            return Promise.resolve(item);
        });
}

function del(uid: string) {
    return Promise.reject('Not implemented');
}

function getList(id: string | number) {
    return Promise.reject('Not implemented');
}
