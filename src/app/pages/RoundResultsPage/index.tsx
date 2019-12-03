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
import { TGuessWords } from 'als-data-types/result';
import { NoResult } from 'als-icons/otherIcons';

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

    if (game && result) {
        const handleContinue = () => {
            history.replace(`/game/${game.uid}`, { gameData: game.toJson() });
        };
        const handleGuess = (guess: TGuessWords) => {
            return (value: boolean) => {
                guess.guess = value;
            };
        };
        return (
            <div className={cn()}>
                <Header title={'Результат'} />
                {result.hasGuesses() ? (
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
                                        <CheckFlip value={guess.guess} onChange={handleGuess(guess)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={cn('no-result')}>
                        <NoResult width={150} height={150} />
                    </div>
                )}
                <Button className={cn('btn')} text={'Продолжить'} type="secondary" onAction={handleContinue} />
            </div>
        );
    } else if (!loaded) {
        return <Loader />;
    }
    return <Redirect to="/" />;
};
