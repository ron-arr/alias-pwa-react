import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { AngelIcon, HipsterIcon, CoffeeManIcon, LgbtIcon } from 'als-icons/teams';

interface IRouterProps {
    gameUid: string;
}

const TeamIcons: { title: string; Icon: Function }[] = [
    {
        title: 'Team 1',
        Icon: AngelIcon,
    },
    {
        title: 'Team 2',
        Icon: HipsterIcon,
    },
    {
        title: 'Team 3',
        Icon: CoffeeManIcon,
    },
    {
        title: 'Team 4',
        Icon: LgbtIcon,
    },
];

interface IProps extends RouteComponentProps<IRouterProps> {}

const cn = classNameBuilder('select-teams');

export const SelectTeamPage: React.FC<IProps> = (props: IProps) => {
    console.log('props', props);
    let history = useHistory();
    console.log('history', history);
    // console.log('match', match);
    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <h1 className={cn('title')}>Выберите 1-ю команду</h1>
            </div>
            <div className={cn('teams')}>
                {TeamIcons.map((TeamIcon, index) => (
                    <div key={index} className={cn('team-wrap')}>
                        <div className={cn('team')}>
                            <span className={cn('team-title')}>{TeamIcon.title}</span>
                            <TeamIcon.Icon width={64} height={64} />
                        </div>
                    </div>
                ))}
                {TeamIcons.map((TeamIcon, index) => (
                    <div key={index + 10} className={cn('team-wrap')}>
                        <div className={cn('team')}>
                            <span className={cn('team-title')}>{TeamIcon.title}</span>
                            <TeamIcon.Icon width={64} height={64} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
