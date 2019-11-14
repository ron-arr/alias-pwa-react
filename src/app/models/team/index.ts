import { ITeam } from './interfaces';

export class Team {
    name: string;

    constructor(data: ITeam) {
        this.name = data.name;
    }
}
