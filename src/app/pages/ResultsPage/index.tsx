import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Header } from 'als-ui';
import { Button } from 'als-ui/controls';
import { teamIcons } from 'als-ui/icons';
import { Game } from 'als-models';
import { Loader } from 'als-components/Loader';
import { gameRepo } from 'als-db';

interface IRouterProps {
    gameUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    loaded: boolean;
    game: null | Game;
}

const cn = classNameBuilder('results');

export const ResultsPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const [state, setState] = useState<IState>({
        loaded: false,
        game: null,
    });
    const { game, loaded } = state;
    const gameUid = match.params.gameUid;
    if (!loaded) {
        gameRepo.get(gameUid).then(game => {
            setState({ ...state, game, loaded: true });
        });
    }
    const handleContinue = () => {
        history.push(`/game/${match.params.gameUid}`, {
            teams: history.location.state.teams,
        });
    };

    if (game) {
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
                        ~game.teams.indexOf(index) ? (
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
