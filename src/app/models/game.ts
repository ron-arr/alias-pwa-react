import { IGameData } from 'als-data-types/game';
import { Team } from 'als-models';
import { teamIcons } from 'als-ui/icons';

const ROUND_TITLES = ['Первый', 'Второй', 'Третий'];

export class Game {
    uid: string;
    teamsCount: number;
    teamIds: number[];
    points: number[];
    level: 1 | 2 | 3;
    roundTime: 30 | 60 | 90 | 120;
    round: number;
    teams: Team[];

    constructor(uid: string, data: IGameData) {
        this.uid = uid;
        this.teamIds = data.teamIds;
        this.level = data.level;
        this.teamsCount = data.teamsCount;
        this.roundTime = data.roundTime;
        this.points = data.points;
        this.round = data.round || 1;

        if (data.teams) {
            this.teams = data.teams.map(teamData => new Team(teamData));
        } else {
            this.teams = this.teamIds.map(
                teamId =>
                    new Team({
                        id: teamId,
                        name: teamIcons[teamId].title,
                        points: 0,
                        lastRound: 0,
                    })
            );
        }
    }

    toJson(): IGameData {
        return {
            teamsCount: this.teamsCount,
            teamIds: this.teamIds,
            level: this.level,
            roundTime: this.roundTime,
            points: this.points,
            teams: this.teams.map(team => team.toJson()),
        };
    }

    get roundTitle(): string {
        return ROUND_TITLES[this.round - 1];
    }

    get currentTeam(): Team | null {
        const team = this.teams.find(team => team.lastRound === this.round - 1);
        return team || null;
    }
}
