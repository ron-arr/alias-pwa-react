export type TResult = { num: number; guess: boolean; word: string };

export interface IResultData {
    gameUid: string;
    dateTime: number;
    results: TResult[];
}
