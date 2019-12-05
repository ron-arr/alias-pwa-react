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

    get lastGuess(): TGuessWords {
        return this.guesses[this.guesses.length - 1];
    }

    set lastGuess(guess: TGuessWords) {
        this.guesses[this.guesses.length - 1] = guess;
    }

    toJson(): IResultData {
        return {
            gameUid: this.gameUid,
            dateTime: this.dateTime,
            guesses: this.guesses,
        };
    }

    getStats(): { accepted: number; skipped: number } {
        return this.guesses.reduce(
            (acc, val) => {
                if (val.status === 'ACCEPTED') {
                    acc.accepted += 1;
                } else if (val.status === 'SKIPPED') {
                    acc.skipped += 1;
                }
                return acc;
            },
            { accepted: 0, skipped: 0 }
        );
    }

    add(guess: TGuessWords) {
        this.guesses.push(guess);
    }

    hasGuessed(): boolean {
        return this.guesses.some(guess => guess.status === 'ACCEPTED');
    }

    getGuesses(): TGuessWords[] {
        return this.guesses.slice(0, this.guesses.length - 1);
    }

    getPoints(): number {
        const { accepted, skipped } = this.getStats();
        return accepted - skipped;
    }
}
