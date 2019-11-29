import { ITeamData } from './team';

export type TLevel = 1 | 2 | 3;
export type TRoundTime = 30 | 60 | 90 | 120;

export interface IGameData {
    teamsCount: number;
    level: TLevel;
    roundTime: TRoundTime;
    round: number;
    teams: ITeamData[];
}
