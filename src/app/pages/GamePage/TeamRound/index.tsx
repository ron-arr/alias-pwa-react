import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { teamIcons } from 'als-ui/icons';
import { Team } from 'als-models';

interface IProps {
    team: Team;
    className?: string;
}
const cn = classNameBuilder('team-round');

export const TeamRound: React.FC<IProps> = ({ className, team }: IProps) => {
    const TeamIcon = teamIcons[team.id];
    return (
        <div className={cn('', [className])}>
            <div className={cn('name')}>{team.name}</div>
            <div>
                <TeamIcon.Icon width={128} height={128} />
            </div>
        </div>
    );
};
