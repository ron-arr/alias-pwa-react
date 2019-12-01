import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Game, Result } from 'als-models';
import { gameRepo, resultRepo } from 'als-db-manager';
import { Loader } from 'als-components/Loader';
import { Header } from 'als-components/Header';
import { TeamRound } from './TeamRound';
import { Button } from 'als-ui/controls';
import { Cards } from './Cards';
import { easy as easyWords, hard as hardWords, norm as normWords } from 'alias-words';
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
    });
    const { game, loaded, status, disabled } = state;
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
        const handleFinish = (result: Result) => {
            const points = result.getPoints();
            game.setPointsForCurrentTeam(points);

            if (game.isRoundPlayed()) {
                game.round += 1;
            }
            console.log('game', game);
            const saveReqs = Promise.all([resultRepo.save(result), gameRepo.save(game)]);
            saveReqs.then(() => {
                setTimeout(() => {
                    history.replace(`/results/${result.uid}`, {
                        gameData: game.toJson(),
                        resultData: result.toJson(),
                    });
                }, 1500);
                setState({ ...state, disabled: true });
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
                {status === 'GAME' && <Cards gameUid={gameUid} words={words} onFinish={handleFinish} />}
                {disabled && <Curtain />}
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }

    return <Redirect to="/" />;
};
