import {
    AngelIcon,
    HipsterIcon,
    CoffeeManIcon,
    LgbtIcon,
    BrainIcon,
    BunnyIcon,
    GhostIcon,
    SportIcon,
    SaleIcon,
} from 'als-icons/teamsIcons';
import { ITeamData, TTeamIcon } from 'als-data-types/team';

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

export const teamIcons: TTeamIcon[] = [
    {
        title: 'Ангелочки',
        Icon: AngelIcon,
    },
    {
        title: 'Чувачки',
        Icon: HipsterIcon,
    },
    {
        title: 'Кофеманы',
        Icon: CoffeeManIcon,
    },
    {
        title: 'Лгбт',
        Icon: LgbtIcon,
    },
    {
        title: 'Мозголобы',
        Icon: BrainIcon,
    },
    {
        title: 'Акционеры',
        Icon: SaleIcon,
    },
    {
        title: 'Полтергейсты',
        Icon: GhostIcon,
    },
    {
        title: 'Спортсмены',
        Icon: SportIcon,
    },
    {
        title: 'Бешеные кролики',
        Icon: BunnyIcon,
    },
];
