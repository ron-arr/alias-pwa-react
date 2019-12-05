export type TGuessWords = {
    status: 'SKIPPED' | 'ACCEPTED' | 'LAST';
    word: string;
};

export interface IResultData {
    gameUid: string;
    dateTime: number;
    guesses: TGuessWords[];
    round: number;
}
