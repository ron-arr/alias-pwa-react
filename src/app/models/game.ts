import { IGameData, TRoundTime } from 'als-data-types/game';
import { Team } from 'als-models';

const ROUND_TITLES = ['Первый', 'Второй', 'Третий'];

export class Game {
    uid: string;
    teamsCount: number;
    pointCounts: number;
    level: 1 | 2 | 3;
    roundTime: TRoundTime;
    round: number;
    teams: Team[];

    // Additional info
    dateTime: number;

    constructor(uid: string, data: IGameData) {
        this.uid = uid;
        this.level = data.level;
        this.teamsCount = data.teamsCount;
        this.pointCounts = data.pointCounts;
        this.roundTime = data.roundTime;
        this.round = data.round;
        this.teams = data.teams.map(teamData => new Team(teamData));
        this.dateTime = data.dateTime;
        if (!this.dateTime) {
            this.dateTime = Date.now();
        }
    }

    toJson(): IGameData {
        return {
            teamsCount: this.teamsCount,
            pointCounts: this.pointCounts,
            level: this.level,
            roundTime: this.roundTime,
            teams: this.teams.map(team => team.toJson()),
            round: this.round,
            dateTime: this.dateTime,
        };
    }

    get roundTitle(): string {
        return ROUND_TITLES[this.round - 1] || this.round.toString();
    }

    get currentTeam(): Team | null {
        const team = this.teams.find(team => team.lastRound === this.round - 1);
        return team || null;
    }

    get winner(): Team | null {
        if (this.teams.every(team => team.lastRound === this.round)) {
            return this.getSortedTeams().find(team => team.points >= this.pointCounts) || null;
        }
        return null;
    }

    getSortedTeams(): Team[] {
        return this.teams.sort((a, b) => (a.points < b.points ? 1 : -1));
    }

    setPointsForCurrentTeam(points: number): void {
        if (this.currentTeam) {
            this.currentTeam.points += points;
            this.currentTeam.lastRound = this.round;
        }
    }

    isRoundPlayed(): boolean {
        return this.teams.every(team => team.lastRound === this.round);
    }
}
