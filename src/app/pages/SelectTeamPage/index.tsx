import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { gameRepo } from 'als-db-manager';
import { Loader } from 'als-components/Loader';
import { Game, Team } from 'als-models';
import { Header } from 'als-components/Header';
import { teamIcons } from 'als-models/team';

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
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData),
        game: gameData ? new Game(gameUid, gameData) : null,
        teamIds: [],
    });
    const { game, loaded, teamIds } = state;
    if (!loaded) {
        gameRepo
            .get(gameUid)
            .then(game => {
                game.teams = [];
                setState({ ...state, game, loaded: true });
            })
            .catch(() => {
                setState({ ...state, loaded: true });
            });
    }

    if (game) {
        const handleChoose = (iconIndex: number) => {
            return () => {
                game.teams.push(
                    new Team({
                        id: iconIndex,
                        name: teamIcons[iconIndex].title,
                        points: 0,
                        lastRound: 0,
                    })
                );
                if (teamIds.length + 1 < game.teamsCount) {
                    setState({ ...state, teamIds: [...teamIds, iconIndex] });
                } else {
                    teamIds.push(iconIndex);
                    gameRepo.save(game).then(() => {
                        history.replace(`/teams/${game.uid}`, { gameData: game.toJson() });
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
