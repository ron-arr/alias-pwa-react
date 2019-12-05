import './styles.scss';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Game, Result } from 'als-models';
import { gameRepo, resultRepo } from 'als-db-manager';
import { Loader } from 'als-components/Loader';
import { Header } from 'als-components/Header';
import { TeamRound } from './TeamRound';
import { Button } from 'als-ui/controls';
import { Cards } from './Cards';
import { shuffle } from 'als-services/utils';
import { Curtain } from 'als-components/Curtain';

type TStatus = 'TEAM' | 'GAME';

interface IRouterProps {
    gameUid: string;
}
interface IState {
    loaded: boolean;
    disabled: boolean;
    game: null | Game;
    status: TStatus;
    words: string[];
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match, history }: IProps) => {
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData),
        disabled: false,
        game: gameData ? new Game(gameUid, gameData) : null,
        status: 'TEAM',
        words: [],
    });
    const { game, loaded, status, disabled, words } = state;
    if (game && !words.length) {
        import('alias-words').then(module => {
            let _words;
            if (game.level === 3) {
                _words = module.hard;
            } else if (game.level === 2) {
                _words = module.norm;
            } else {
                _words = module.easy;
            }
            setState({ ...state, words: shuffle(_words) });
        });
    }
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
    const handleFinish = useCallback(
        (result: Result) => {
            if (game) {
                result.round = game.round;
                const saveReqs = Promise.all([resultRepo.save(result), gameRepo.save(game)]);
                saveReqs.then(() => {
                    setTimeout(() => {
                        history.replace(`/results/${result.uid}`, {
                            gameData: game.toJson(),
                            resultData: result.toJson(),
                        });
                    }, 3000);
                    setState(prevState => ({ ...prevState, status: 'GAME', disabled: true }));
                });
            }
        },
        [game]
    );

    if (game && game.currentTeam) {
        const handleStart = () => {
            setState({ ...state, status: 'GAME' });
        };
        return (
            <div className={cn()}>
                {status === 'TEAM' && (
                    <>
                        <Header title={`${game.roundTitle} раунд`} />
                        <TeamRound className={cn('team')} team={game.currentTeam} />
                        <Button className={cn('start-btn')} text="Начать" onAction={handleStart} />
                    </>
                )}
                {status === 'GAME' && words && <Cards gameUid={gameUid} words={words} onFinish={handleFinish} time={game.roundTime} />}
                {disabled && <Curtain />}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
