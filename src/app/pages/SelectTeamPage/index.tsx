import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Header } from 'als-ui';
import { teamIcons } from 'als-ui/icons';
import { gameRepo } from 'als-db';
import { Loader } from 'als-components/Loader';
import { Game } from 'als-models';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    loaded: boolean;
    game: null | Game;
    teams: number[];
}

const cn = classNameBuilder('select-teams');

export const SelectTeamPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const [state, setState] = useState<IState>({
        loaded: false,
        game: null,
        teams: [],
    });
    const { game, loaded, teams } = state;
    const gameUid = match.params.gameUid;
    if (!loaded) {
        gameRepo.get(gameUid).then(game => {
            setState({ ...state, game, loaded: true });
        });
    }

    console.log('game', game);

    if (game) {
        const handleChoose = (iconIndex: number) => {
            return () => {
                if (teams.length + 1 < game.teamsCount) {
                    setState({ ...state, teams: [...teams, iconIndex] });
                } else {
                    teams.push(iconIndex);
                    game.teams = teams;
                    game.points = teams.map(team => 0);
                    gameRepo.save(game).then(() => {
                        history.push(`/results/${game.uid}`);
                    });
                }
            };
        };

        return (
            <div className={cn()}>
                <Header title={`Выберите ${teams.length + 1}-ю команду`} />
                <div className={cn('teams')}>
                    {teamIcons.map((TeamIcon, index) => {
                        if (!~teams.indexOf(index)) {
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
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
