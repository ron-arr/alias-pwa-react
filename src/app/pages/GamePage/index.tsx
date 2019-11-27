import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Game } from 'als-models';
import { gameRepo } from 'als-db';
import { Loader } from 'als-components/Loader';
import { Header } from 'als-components/Header';
import { TeamRound } from './TeamRound';
import { Button } from 'als-ui/controls';
import { Cards } from './Cards';

type TStatus = 'TEAM' | 'GAME';

interface IRouterProps {
    gameUid: string;
}
interface IState {
    loaded: boolean;
    game: null | Game;
    status: TStatus;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match, history }: IProps) => {
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData),
        game: gameData ? new Game(gameUid, gameData) : null,
        status: 'GAME',
    });
    const { game, loaded, status } = state;
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
    if (game && game.currentTeam) {
        const handleStart = () => () => {};

        return (
            <div className={cn()}>
                {status === 'TEAM' && (
                    <>
                        <Header title={`${game.roundTitle} раунд`} />
                        <TeamRound className={cn('team')} team={game.currentTeam} />
                        <Button className={cn('start-btn')} text="Начать" onAction={handleStart} />
                    </>
                )}
                {status === 'GAME' && <Cards team={game.currentTeam} />}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
