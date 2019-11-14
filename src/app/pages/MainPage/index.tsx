import './styles.scss';
import * as React from 'react';
import { Button } from 'als-ui/controls';
import { GameSettings } from 'als-components/GameSettings';
import { classNameBuilder } from 'als-services/className';
import { browserHistory } from 'als-routes/browserHistory';
import { getRandomString } from 'als-services/utils';

interface IProps {}

const cn = classNameBuilder('main');

const handleStart = () => {
    browserHistory.push(`/game/${getRandomString()}`);
};

export const MainPage: React.FC<IProps> = (props: IProps) => {
    return (
        <div className={cn()}>
            <div className={cn('title')}>Alias</div>
            <GameSettings />
            <div>
                <Button text={'Начать'} onAction={handleStart} />
            </div>
        </div>
    );
};
