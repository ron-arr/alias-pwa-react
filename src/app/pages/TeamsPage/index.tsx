import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Button } from 'als-ui/controls';
import { teamIcons } from 'als-ui/icons';
import { Game } from 'als-models';
import { Loader } from 'als-components/Loader';
import { gameRepo } from 'als-db-manager';
import { Header } from 'als-components/Header';

interface IRouterProps {
    gameUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    loaded: boolean;
    game: null | Game;
}

const cn = classNameBuilder('teams');

export const TeamsPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData),
        game: gameData ? new Game(gameUid, gameData) : null,
    });
    const { game, loaded } = state;
    if (!loaded) {
        gameRepo
            .get(match.params.gameUid)
            .then(game => {
                setState({ ...state, game, loaded: true });
            })
            .catch(() => {
                setState({ ...state, loaded: true });
            });
    }

    if (game) {
        const handleContinue = () => {
            history.replace(`/game/${game.uid}`, { gameData: game.toJson() });
        };
        return (
            <div className={cn()}>
                <Header title={'Команды'} />
                <div className={cn('table')}>
                    <div className={cn('row')}>
                        <div className={cn('col')}></div>
                        <div className={cn('col', { head: true })}>Команда</div>
                        <div className={cn('col', { head: true })}>Очки</div>
                    </div>
                    {game.teams.map(team => {
                        const TeamIcon = teamIcons[team.id];
                        return (
                            <div key={team.id} className={cn('row')}>
                                <div className={cn('col')}>
                                    <TeamIcon.Icon width={32} height={32} />
                                </div>
                                <div className={cn('col')}>{team.name}</div>
                                <div className={cn('col')}>{team.points}</div>
                            </div>
                        );
                    })}
                </div>
                <div className={cn('btn')}>
                    <Button text={'Продолжить'} type="secondary" onAction={handleContinue} />
                </div>
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }
    return <Redirect to="/" />;
};