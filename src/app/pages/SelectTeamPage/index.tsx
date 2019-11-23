import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { teamIcons } from 'als-ui/icons';
import { gameRepo } from 'als-db';
import { Loader } from 'als-components/Loader';
import { Game } from 'als-models';
import { Header } from 'als-components/Header';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    loaded: boolean;
    game: null | Game;
    teamIds: number[];
}

const cn = classNameBuilder('select-teams');

export const SelectTeamPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const [state, setState] = useState<IState>({
        loaded: false,
        game: null,
        teamIds: [],
    });
    const { game, loaded, teamIds } = state;
    const gameUid = match.params.gameUid;
    if (!loaded) {
        gameRepo
            .get(gameUid)
            .then(game => {
                setState({ ...state, game, loaded: true });
            })
            .catch(() => {
                setState({ ...state, loaded: true });
            });
    }

    console.log('game', game);

    if (game) {
        const handleChoose = (iconIndex: number) => {
            return () => {
                if (teamIds.length + 1 < game.teamsCount) {
                    setState({ ...state, teamIds: [...teamIds, iconIndex] });
                } else {
                    teamIds.push(iconIndex);
                    game.teamIds = teamIds;
                    game.points = teamIds.map(team => 0);
                    gameRepo.save(game).then(() => {
                        history.push(`/ready/${game.uid}`);
                    });
                }
            };
        };

        return (
            <div className={cn()}>
                <Header title={`Выберите ${teamIds.length + 1}-ю команду`} />
                <div className={cn('teams')}>
                    {teamIcons.map((TeamIcon, index) => {
                        if (!~teamIds.indexOf(index)) {
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
