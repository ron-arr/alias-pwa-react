import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { teamIcons } from 'als-models/team/icons';
import { Header } from 'als-ui';

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
            return () => {
                if (selectedTeams.length + 1 < teamsCount) {
                    setTeams([...selectedTeams, iconIndex]);
                } else {
                    selectedTeams.push(iconIndex);
                    history.push(`/results/${match.params.gameUid}`, {
                        teams: selectedTeams,
                    });
                }
            };
        };

        return (
            <div className={cn()}>
                <Header title={`Выберите ${selectedTeams.length + 1}-ю команду`} />
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
    }

    return <Redirect to="/" />;
};
