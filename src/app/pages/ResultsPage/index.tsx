import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { teamIcons } from 'als-models/team/icons';
import { Header } from 'als-ui';
import { Button } from 'als-ui/controls';

interface IRouterProps {
    gameUid: string;
}
interface IProps extends RouteComponentProps<IRouterProps> {}

const cn = classNameBuilder('results');

export const ResultsPage: React.FC<IProps> = ({ history, match }: IProps) => {
    const handleContinue = () => {
        history.push(`/game/${match.params.gameUid}`, {
            teams: history.location.state.teams,
        });
    };

    if (history.location.state) {
        const teams: number[] = history.location.state.teams;
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
                        ~teams.indexOf(index) ? (
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
    }
    return <Redirect to="/" />;
};
