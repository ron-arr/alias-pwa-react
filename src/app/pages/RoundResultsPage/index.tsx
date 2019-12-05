import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Button } from 'als-ui/controls';
import { Game, Result } from 'als-models';
import { Loader } from 'als-components/Loader';
import { gameRepo, resultRepo } from 'als-db-manager';
import { Header } from 'als-components/Header';
import { THistoryState } from 'als-data-types/history';
import { CheckFlip } from 'als-components/CheckFlip';
import { NoResult } from 'als-icons/otherIcons';
import { teamIcons } from 'als-ui/icons';

interface IRouterProps {
    resultUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}

interface IState {
    loaded: boolean;
    game: null | Game;
    result: null | Result;
}

const cn = classNameBuilder('round-results');

export const RoundResultsPage: React.FC<IProps> = ({ history, match }: IProps) => {
    let { gameData = undefined, resultData = undefined }: THistoryState = history.location.state ? history.location.state : {};
    const resultUid = match.params.resultUid;
    const [state, setState] = useState<IState>({
        loaded: Boolean(gameData && resultData),
        result: resultData ? new Result(resultUid, resultData) : null,
        game: gameData && resultData ? new Game(resultData.gameUid, gameData) : null,
    });
    const { game, result, loaded } = state;
    if (!loaded) {
        resultRepo
            .get(resultUid)
            .then(result => {
                gameRepo.get(result.gameUid).then(game => {
                    setState({ ...state, game, result, loaded: true });
                });
            })
            .catch(() => {
                setState({ ...state, loaded: true });
            });
    }

    if (game && result && game.currentTeam) {
        const handleContinue = () => {
            const points = result.getPoints();
            game.setPointsForCurrentTeam(points);
            const saveReqs = Promise.all([resultRepo.save(result), gameRepo.save(game)]);
            saveReqs.then(() => {
                history.replace(`/teams/${game.uid}`, { gameData: game.toJson() });
            });
        };
        const handleGuess = (index: number) => {
            return (value: boolean) => {
                result.guesses[index].status = value ? 'ACCEPTED' : 'SKIPPED';
                setState({ ...state, result });
            };
        };

        const handleLastGuess = (value: boolean) => {
            const guess = result.lastGuess;
            guess.status = value ? 'ACCEPTED' : 'LAST';
            result.lastGuess = guess;
            setState({ ...state, result });
        };

        const points = result.getPoints();
        return (
            <div className={cn()}>
                <Header title={'Результат'} teamIcon={teamIcons[game.currentTeam.id]} />
                <div className={cn('stats-title')}>
                    Количество очков:
                    <span className={cn('stats', { pos: points > 0, neg: points < 0 })}>{points}</span>
                </div>
                <div className={cn('table')}>
                    <div className={cn('row')}>
                        <div className={cn('col', { head: true })}>Слово</div>
                        <div className={cn('col', { head: true })}>Отгадано</div>
                    </div>
                    {result.getGuesses().map((guess, index) => {
                        return (
                            <div key={index} className={cn('row')}>
                                <div className={cn('col')}>{guess.word}</div>
                                <div className={cn('col')}>
                                    <CheckFlip id={index} value={guess.status === 'ACCEPTED'} onChange={handleGuess(index)} />
                                </div>
                            </div>
                        );
                    })}
                    <div className={cn('row')}>
                        <div className={cn('col')}>{result.lastGuess.word}</div>
                        <div className={cn('col')}>
                            <CheckFlip
                                id={result.guesses.length}
                                value={result.lastGuess.status === 'ACCEPTED'}
                                onChange={handleLastGuess}
                            />
                        </div>
                    </div>

                    <div className={cn('no-points', { visible: !result.hasGuessed() })}>
                        <NoResult width={150} height={150} />
                    </div>
                </div>
                <Button className={cn('btn')} text={'Продолжить'} type="secondary" onAction={handleContinue} />
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }
    return <Redirect to="/" />;
};
