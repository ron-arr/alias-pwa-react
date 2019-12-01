import { TLevel, TRoundTime } from 'als-data-types/game';
import { Game } from 'als-models';
import { getRandomString } from 'als-services/utils';

export class GameSettings {
    gameUid: string;
    teamsCount: number;
    level: TLevel;
    roundTime: TRoundTime;
    pointCounts: number;

    constructor() {
        this.gameUid = getRandomString();
        this.teamsCount = 2;
        this.level = 1;
        this.roundTime = 60;
        this.pointCounts = 30;
    }

    createGame() {
        return new Game(this.gameUid, {
            level: this.level,
            roundTime: this.roundTime,
            teamsCount: this.teamsCount,
            pointCounts: this.pointCounts,
            round: 1,
            teams: [],
        });
    }

    get levelTitle(): string {
        const level = GameSettings.getLevels().find(lvl => lvl.value === this.level);
        return level ? level.title : '';
    }

    get roundTimeTitle(): string {
        const roundTime = GameSettings.getRoundTimes().find(round => round.value === this.roundTime);
        return roundTime ? roundTime.title : '';
    }

    static getTeamsCount() {
        return [2, 3, 4, 5, 6];
    }

    static getLevels(): { title: string; value: TLevel }[] {
        return [
            { title: 'Простой', value: 1 },
            { title: 'Нормальный', value: 2 },
            { title: 'Сложный', value: 3 },
        ];
    }

    static getRoundTimes(): { title: string; value: TRoundTime }[] {
        return [
            { title: '30 сек', value: 30 },
            { title: '1 мин', value: 60 },
            { title: '1 мин 30 сек', value: 90 },
            { title: '2 мин', value: 120 },
        ];
    }

    static getPointCounts(): number[] {
        return [30, 40, 50, 60];
    }
}
