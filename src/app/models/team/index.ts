import { ITeam } from 'models/team/interfaces';

export class Team {
    name: string;

    constructor(data: ITeam) {
        this.name = data.name;
    }
}
