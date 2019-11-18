import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps } from 'react-router-dom';
import { teamIcons } from 'als-models/team/icons';

interface IRouterProps {
    gameUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}

const cn = classNameBuilder('results');

export const ResultsPage: React.FC<IProps> = ({ history }: IProps) => {
    console.log('history', history);
    if (history.location.state) {
        const teams: number[] = history.location.state.teams;
        console.log('teams', teams);
        return (
            <div className={cn()}>
                <div className={cn('title')}>Results</div>
                {teamIcons.map((TeamIcon, index) => {
                    if (~teams.indexOf(index)) {
                        return (
                            <div key={index} className={cn('team-wrap')}>
                                <div className={cn('team')}>
                                    <span className={cn('team-title')}>{TeamIcon.title}</span>
                                    <TeamIcon.Icon width={32} height={32} />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }
    history.replace('/');
    return null;
};
