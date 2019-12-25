import './styles.scss';
import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Game, Result } from 'als-models';
import { gameRepo, resultRepo } from 'als-db-manager';
import { Loader } from 'als-components/Loader';
import { TeamRound } from './TeamRound';
import { Button } from 'als-ui/controls';
import { Cards } from './Cards';
import { shuffle } from 'als-services/utils';
import { Curtain } from 'als-components/Curtain';
import { AppContext, IAppContext } from 'als-contexts/app';

type TStatus = 'TEAM' | 'GAME';

interface IRouterProps {
    gameUid: string;
}
interface IState {
    loaded: boolean;
    disabled: boolean;
    game: null | Game;
    status: TStatus;
    words: string[] | null;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match, history }: IProps) => {
    const context = useContext<IAppContext>(AppContext);
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData),
        disabled: false,
        game: gameData ? new Game(gameUid, gameData) : null,
        status: 'TEAM',
        words: null,
    });
    const { game, loaded, status, disabled, words } = state;
    useEffect(() => {
        if (status === 'TEAM' && game) {
            context.showHeader();
            context.setHeaderProps({ title: `${game.roundTitle} раунд` });
        } else {
            context.hideHeader();
        }
        if (game && !words) {
            let wordsModule;
            if (game.level === 3) {
                wordsModule = import('alias-words/hard');
            } else if (game.level === 2) {
                wordsModule = import('alias-words/norm');
            } else {
                wordsModule = import('alias-words/easy');
            }
            wordsModule.then(module => {
                setState({ ...state, words: shuffle(module.default) });
            });
        }
    }, [game, status]);

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
                setState(prevState => ({ ...prevState, status: 'GAME', disabled: true }));
                const saveReqs = Promise.all([resultRepo.save(result), gameRepo.save(game)]);
                saveReqs.then(() => {
                    setTimeout(() => {
                        history.replace(`/results/${result.uid}`, {
                            gameData: game.toJson(),
                            resultData: result.toJson(),
                        });
                    }, 3000);
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
