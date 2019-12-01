import { IResultData, TResult } from 'als-data-types/result';
import { getRandomString } from 'als-services/utils';

export class Result {
    uid: string;
    gameUid: string;
    dateTime: number;
    results: TResult[];

    constructor(gameUid: string);
    constructor(uid: string, data: IResultData);
    constructor(gameUidOrUid: string, data?: IResultData) {
        if (data) {
            this.uid = gameUidOrUid;
            this.gameUid = data.gameUid;
            this.dateTime = data.dateTime || Date.now();
            this.results = data.results;
        } else {
            this.uid = getRandomString();
            this.gameUid = gameUidOrUid;
            this.dateTime = Date.now();
            this.results = [];
        }
    }

    toJson(): IResultData {
        return {
            gameUid: this.gameUid,
            dateTime: this.dateTime,
            results: this.results,
        };
    }

    add(result: TResult) {
        this.results.push(result);
    }

    get(): TResult[] {
        return this.results;
    }

    getPoints(): number {
        return this.results.reduce((a, result) => a + (result.guess ? 1 : -1), 0);
    }
}
