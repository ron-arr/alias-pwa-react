import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps } from 'react-router-dom';
import { teamIcons } from 'als-models/team/icons';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}

const cn = classNameBuilder('select-teams');

export const SelectTeamPage: React.FC<IProps> = ({ history, match }: IProps) => {
    if (history.location.state) {
        const { teamsCount } = history.location.state as { teamsCount: number };
        const [selectedTeams, setTeams] = React.useState<number[]>([]);
        const handleChoose = (iconIndex: number) => {
            if (selectedTeams.length + 1 < teamsCount) {
                return () => {
                    setTeams([...selectedTeams, iconIndex]);
                };
            } else {
                return () => {
                    history.replace(`/results/${match.params.gameUid}`, {
                        teams: selectedTeams,
                    });
                };
            }
        };

        return (
            <div className={cn()}>
                <div className={cn('header')}>
                    <h1 className={cn('title')}>{`Выберите ${selectedTeams.length + 1}-ю команду`}</h1>
                </div>
                <div className={cn('teams')}>
                    {teamIcons.map((TeamIcon, index) => {
                        if (!~selectedTeams.indexOf(index)) {
                            return (
                                <div key={index} className={cn('team-wrap')}>
                                    <button className={cn('team')} onClick={handleChoose(index)}>
                                        <span className={cn('team-title')}>{TeamIcon.title}</span>
                                        <TeamIcon.Icon width={64} height={64} />
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    } else {
        history.replace('/');
        return null;
    }
};
