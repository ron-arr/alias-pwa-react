import { db } from './firebaseConfig';
import { IRepository } from './repoTypes';
import { Game } from 'als-models';
import { IGameData } from 'als-data-types/game';

const gameRef = db.collection('game');

interface IGameRepo extends IRepository<Game> {
    get: (uid: string) => Promise<Game>;
}

export const gameRepo: IGameRepo = {
    get,
    save,
    getList,
    del,
};

function get(uid: string) {
    console.log('get game from firebase')
    return gameRef
        .doc(uid)
        .get()
        .then(doc => {
            if (doc.exists) {
                return Promise.resolve(new Game(doc.id, doc.data() as IGameData));
            } else {
                return Promise.reject('Not found');
            }
        });
}

function save(item: Game) {
    return gameRef
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
