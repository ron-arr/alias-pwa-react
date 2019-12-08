import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { TTeamIcon } from 'als-data-types/team';

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
