import { IResultData, TGuessWords } from 'als-data-types/result';
import { getRandomString } from 'als-services/utils';

export class Result {
    uid: string;
    gameUid: string;
    dateTime: number;
    guesses: TGuessWords[];

    constructor(gameUid: string);
    constructor(uid: string, data: IResultData);
    constructor(gameUidOrUid: string, data?: IResultData) {
        if (data) {
            this.uid = gameUidOrUid;
            this.gameUid = data.gameUid;
            this.dateTime = data.dateTime || Date.now();
            this.guesses = data.guesses;
        } else {
            this.uid = getRandomString();
            this.gameUid = gameUidOrUid;
            this.dateTime = Date.now();
            this.guesses = [];
        }
    }

    toJson(): IResultData {
        return {
            gameUid: this.gameUid,
            dateTime: this.dateTime,
            guesses: this.guesses,
        };
    }

    hasGuesses(): boolean {
        return this.guesses.length > 0;
    }

    add(guess: TGuessWords) {
        this.guesses.push(guess);
    }

    getGuesses(): TGuessWords[] {
        return this.guesses;
    }

    getPoints(): number {
        return this.guesses.reduce((a, guess) => a + (guess.guess ? 1 : -1), 0);
    }
}
