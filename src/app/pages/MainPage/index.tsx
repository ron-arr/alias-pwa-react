import './styles.scss';
import * as React from 'react';
import { Button } from 'als-ui/controls';
import { GameSettings } from 'als-components/GameSettings';
import { classNameBuilder } from 'als-services/className';
import { getRandomString } from 'als-services/utils';
import { useHistory } from 'react-router-dom';

interface IProps {}

const cn = classNameBuilder('main');

const handleStart = (teamsCount: number) => {
    const history = useHistory();
    return () => {
        history.push(`/select-teams/${getRandomString()}`, {
            teamsCount,
        });
    };
};

export const MainPage: React.FC<IProps> = (props: IProps) => {
    const [teamsCount, setTeamsCount] = React.useState(2);
    return (
        <div className={cn()}>
            <div className={cn('title')}>Alias</div>
            <GameSettings onChangeTeamsCnt={setTeamsCount} />
            <div>
                <Button text={'Продолжить'} type="secondary" onAction={handleStart(teamsCount)} />
            </div>
        </div>
    );
};
