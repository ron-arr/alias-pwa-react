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

export const GamePage: React.FC<IProps> = ({ match }: IProps) => {
    const [state, setState] = useState<IState>({
        loaded: false,
        game: null,
        status: 'TEAM',
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
                <Header title={`${game.roundTitle} раунд`} />
                {status === 'TEAM' && (
                    <>
                        <TeamRound className={cn('team')} team={game.currentTeam} />
                        <Button className={cn('start-btn')} text="Начать" onAction={handleStart} />
                    </>
                )}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
