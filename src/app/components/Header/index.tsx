import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { TTeamIcon } from 'als-data-types/team';
import { Drawer } from './Drawer';

export interface IHeaderProps {
    title: string;
    teamIcon?: TTeamIcon;
}
const cn = classNameBuilder('header');

export const Header: React.FC<IHeaderProps> = ({ title, teamIcon }: IHeaderProps) => {
    console.log('Header');
    return (
        <header className={cn('', { empty: !title })}>
            <Drawer />
            <h1 className={cn('title')}>
                {title}
                {teamIcon && (
                    <div className={cn('icon')}>
                        <teamIcon.Icon width={24} height={24} />
                    </div>
                )}
            </h1>
        </header>
    );
};
