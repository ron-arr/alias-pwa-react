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
import { Cards, TResult } from './Cards';
import { easy as easyWords, hard as hardWords, norm as normWords } from 'alias-words';
import { shuffle } from 'als-services/utils';

type TStatus = 'TEAM' | 'GAME';

interface IRouterProps {
    gameUid: string;
}
interface IState {
    loaded: boolean;
    curtain: boolean;
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
        curtain: false,
        game: gameData ? new Game(gameUid, gameData) : null,
        status: 'TEAM',
    });
    const { game, loaded, status, curtain } = state;
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
        const handleStart = () => {
            setState({ ...state, status: 'GAME' });
        };
        const handleFinish = (results: TResult[]) => {
            console.log('handleFinish')
            const points = results.reduce((a, result) => a + (result.guess ? 1 : -1), 0);
            console.log('points', points);
            game.setPointsForCurrentTeam(points);
            if (game.isRoundPlayed()) {
                game.round += 1;
            }
            console.log('game', game);
            gameRepo.save(game).then(() => {
                setTimeout(() => {
                    history.replace(`/ready/${game.uid}`, { gameData: game.toJson() });
                }, 1500);
                setState({ ...state, curtain: true });
            });
        };

        let words;
        if (game.level === 3) {
            words = hardWords;
        } else if (game.level === 2) {
            words = normWords;
        } else {
            words = easyWords;
        }

        words = shuffle(words);

        return (
            <div className={cn()}>
                {status === 'TEAM' && (
                    <>
                        <Header title={`${game.roundTitle} раунд`} />
                        <TeamRound className={cn('team')} team={game.currentTeam} />
                        <Button className={cn('start-btn')} text="Начать" onAction={handleStart} />
                    </>
                )}
                {status === 'GAME' && <Cards words={words} onFinish={handleFinish} />}
                {curtain && <div className={cn('curtain')}></div>}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
