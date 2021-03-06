import { ITeamData } from './team';

export type TLevel = 1 | 2 | 3;
export type TRoundTime = 10 | 30 | 45 | 60 | 90 | 120;

export interface IGameData {
    dateTime: number;
    teamsCount: number;
    pointCounts: number;
    level: TLevel;
    roundTime: TRoundTime;
    round: number;
    teams: ITeamData[];
}
