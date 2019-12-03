export type TGuessWords = {
    guess: boolean;
    word: string;
};

export interface IResultData {
    gameUid: string;
    dateTime: number;
    guesses: TGuessWords[];
}
