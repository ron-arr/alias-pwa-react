import { TLevel, TRoundTime, IGameData } from 'als-data-types/game';
import { Game } from 'als-models';
import { getRandomString } from 'als-services/utils';

const CURRENT_GAME_DATA_KEY = 'currentGame';
const CURRENT_GAME_UID_KEY = 'currentGameUid';

type TSavedGameData = IGameData & { uid: string };

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
            dateTime: Date.now(),
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
            { title: '10 сек', value: 10 },
            { title: '30 сек', value: 30 },
            { title: '45 сек', value: 45 },
            { title: '1 мин', value: 60 },
            { title: '1 мин 30 сек', value: 90 },
            { title: '2 мин', value: 120 },
        ];
    }

    static getPointCounts(): number[] {
        return [30, 40, 50, 60];
    }

    static saveCurrentGame(game: Game) {
        localStorage.setItem(CURRENT_GAME_DATA_KEY, JSON.stringify(game.toJson()));
        localStorage.setItem(CURRENT_GAME_UID_KEY, game.uid);
    }

    static getCurrentGame(): TSavedGameData | null {
        const currentGameJson = localStorage.getItem(CURRENT_GAME_DATA_KEY);
        const currentGameUid = localStorage.getItem(CURRENT_GAME_UID_KEY);
        if (currentGameJson && currentGameUid) {
            return { uid: currentGameUid, ...JSON.parse(currentGameJson) };
        }
        return null;
    }

    static getCurrentGameUid() {
        return localStorage.getItem(CURRENT_GAME_UID_KEY);
    }

    static resetGame() {
        localStorage.clear();
    }
}
