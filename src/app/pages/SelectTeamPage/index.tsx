import './styles.scss';
import React, { useState, useContext, useMemo, useEffect, memo } from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { gameRepo } from 'als-db-manager';
import { Loader } from 'als-components/Loader';
import { Game, Team, GameSettings } from 'als-models';
import { teamIcons } from 'als-models/team';
import { IAppContext, AppContext } from 'als-contexts/app';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
interface IState {
    game: null | Game;
    teamIds: number[];
}

const cn = classNameBuilder('select-teams');

export const SelectTeamPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const context = useContext<IAppContext>(AppContext);
    const gameData = history.location.state ? history.location.state.gameData : null;
    const gameUid = match.params.gameUid;
    const [state, setState] = useState<IState>({
        game: gameData ? new Game(gameUid, gameData) : null,
        teamIds: [],
    });
    const { game, teamIds } = state;
    useEffect(() => {
        context.showHeader();
        context.setHeaderProps({ title: `Выберите ${teamIds.length + 1}-ю команду` });
    }, [teamIds]);

    if (game) {
        const handleChoose = (iconIndex: number) => {
            return () => {
                if (game.teams.findIndex(team => team.id === iconIndex) === -1) {
                    game.teams.push(
                        new Team({
                            id: iconIndex,
                            name: teamIcons[iconIndex].title,
                            points: 0,
                            lastRound: 0,
                        })
                    );
                    if (teamIds.length + 1 < game.teamsCount) {
                        setState(prevState => ({ ...prevState, teamIds: [...teamIds, iconIndex] }));
                    } else {
                        teamIds.push(iconIndex);
                        gameRepo.save(game).then(() => {
                            GameSettings.saveCurrentGame(game);
                            history.replace(`/teams/${game.uid}`, { gameData: game.toJson() });
                        });
                    }
                }
            };
        };

        return (
            <div className={cn()}>
                <div className={cn('teams')}>
                    {teamIcons.map((TeamIcon, index) => {
                        if (!~teamIds.indexOf(index)) {
                            return (
                                <div key={index} className={cn('team-wrap')}>
                                    <button className={cn('team')} onClick={handleChoose(index)}>
                                        <span className={cn('team-title')}>{TeamIcon.title}</span>
                                        <TeamIcon.Icon width={64} height={64} />
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    } else {
        return <Redirect to="/" />;
    }
};
