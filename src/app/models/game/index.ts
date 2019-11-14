import { IGame } from './interfaces';

export class Game {
    uid: string;

    constructor(data: IGame) {
        this.uid = data.uid;
    }
}
