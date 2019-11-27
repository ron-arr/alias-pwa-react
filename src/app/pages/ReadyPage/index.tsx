import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Button } from 'als-ui/controls';
import { teamIcons } from 'als-ui/icons';
import { Game } from 'als-models';
import { Loader } from 'als-components/Loader';
import { gameRepo } from 'als-db';
import { Header } from 'als-components/Header';

interface IRouterProps {
    gameUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    loaded: boolean;
    game: null | Game;
}

const cn = classNameBuilder('ready');

export const ReadyPage: React.FC<IProps> = ({ history, match }: IProps) => {
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
            history.push(`/game/${game.uid}`, { gameData: game.toJson() });
        };
        return (
            <div className={cn()}>
                <Header title={'Команды'} />
                <div className={cn('table')}>
                    <div className={cn('row')}>
                        <div className={cn('col')}></div>
                        <div className={cn('col', { th: true })}>Команда</div>
                        <div className={cn('col', { th: true })}>Очки</div>
                    </div>
                    {teamIcons.map((TeamIcon, index) =>
                        ~game.teamIds.indexOf(index) ? (
                            <div key={index} className={cn('row')}>
                                <div className={cn('col')}>
                                    <TeamIcon.Icon width={32} height={32} />
                                </div>
                                <div className={cn('col')}>{TeamIcon.title}</div>
                                <div className={cn('col')}>0</div>
                            </div>
                        ) : null
                    )}
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
