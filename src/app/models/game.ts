import { IGameData } from 'als-data-types/game';
import { Team } from 'als-models';
import { teamIcons } from 'als-ui/icons';

const ROUND_TITLES = ['Первый', 'Второй', 'Третий'];

export class Game {
    uid: string;
    teamsCount: number;
    level: 1 | 2 | 3;
    roundTime: 30 | 60 | 90 | 120;
    round: number;
    teams: Team[];

    constructor(uid: string, data: IGameData) {
        this.uid = uid;
        this.level = data.level;
        this.teamsCount = data.teamsCount;
        this.roundTime = data.roundTime;
        this.round = data.round;
        this.teams = data.teams.map(teamData => new Team(teamData));
    }

    toJson(): IGameData {
        return {
            teamsCount: this.teamsCount,
            level: this.level,
            roundTime: this.roundTime,
            teams: this.teams.map(team => team.toJson()),
            round: this.round,
        };
    }

    get roundTitle(): string {
        return ROUND_TITLES[this.round - 1] || this.round.toString();
    }

    get currentTeam(): Team | null {
        const team = this.teams.find(team => team.lastRound === this.round - 1);
        return team || null;
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
