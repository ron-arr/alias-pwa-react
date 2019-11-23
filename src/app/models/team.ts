import { ITeamData } from 'als-data-types/team';

export class Team {
    id: number;
    name: string;
    points: number;
    lastRound: number;

    constructor(data: ITeamData) {
        this.id = data.id;
        this.name = data.name;
        this.points = data.points;
        this.lastRound = data.lastRound;
        
    }

    toJson(): ITeamData {
        return {
            id: this.id,
            name: this.name,
            points: this.points,
            lastRound: this.lastRound,
        };
    }
}
