import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Game } from 'als-models';
import { gameRepo } from 'als-db';
import { Loader } from 'als-components/Loader';
import { Header } from 'als-components/Header';
import { TeamRound } from './TeamRound';

interface IRouterProps {
    gameUid: string;
}
interface IState {
    loaded: boolean;
    game: null | Game;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match }: IProps) => {
    const [state, setState] = useState<IState>({
        loaded: false,
        game: null,
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
    if (game && game.currentTeam) {
        return (
            <div className={cn()}>
                <Header title={`${game.roundTitle} раунд`} />
                {game.currentTeam && <TeamRound className={cn('team')} team={game.currentTeam} />}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
