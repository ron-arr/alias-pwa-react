import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { HipsterIcon } from 'als-icons/teamsIcons';
import { TTeamIcon } from 'als-ui/icons';

interface IProps {
    title: string;
    teamIcon?: TTeamIcon;
}
const cn = classNameBuilder('header');

export const Header: React.FC<IProps> = ({ title, teamIcon }: IProps) => {
    return (
        <div className={cn()}>
            <h1 className={cn('title')}>
                {title}
                {teamIcon && (
                    <div className={cn('icon')}>
                        <teamIcon.Icon width={24} height={24} />
                    </div>
                )}
            </h1>
        </div>
    );
};
