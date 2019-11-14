import './styles.scss';
import * as React from 'react';
import { AlsButton } from 'ui/controls';
import { GameSettings } from 'components/GameSettings';
import { classNameBuilder } from 'services/className';

interface IProps {}

const cn = classNameBuilder('main');

export const Main: React.FC<IProps> = (props: IProps) => {
    return (
        <div className={cn()}>
            <div className={cn('title')}>Alias</div>
            <GameSettings />
            <div>
                <AlsButton text={'Начать'} onAction={() => {}} />
            </div>
        </div>
    );
};
