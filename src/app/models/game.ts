import { IGameData } from 'als-data-types/game';

export class Game {
    uid: string;
    teamsCount: number;
    teams: number[];
    points: number[];
    level: 1 | 2 | 3;
    roundTime: 30 | 60 | 90 | 120;

    constructor(uid: string, data: IGameData) {
        this.uid = uid;
        this.teams = data.teams;
        this.level = data.level;
        this.teamsCount = data.teamsCount;
        this.roundTime = data.roundTime;
        this.points = data.points;
    }

    toJson(): IGameData {
        return {
            teamsCount: this.teamsCount,
            teams: this.teams,
            level: this.level,
            roundTime: this.roundTime,
            points: this.points,
        };
    }
}
