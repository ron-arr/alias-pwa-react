import './styles.scss';
import * as React from 'react';
import { useState } from 'react';
import { AlsInput, AlsButton } from 'ui/controls';
import { GameSettings } from 'components/GameSettings';
import { classNameBuilder } from 'services/className';

interface IProps {}

const cn = classNameBuilder('main');

export const Main: React.FC<IProps> = (props: IProps) => {
    const [count, setCount] = useState(2);

    return (
        <div className={cn()}>
            <h1>Alias</h1>
            --
            <GameSettings />
            --
            <AlsInput
                title={'Teams count'}
                type="number"
                min="1"
                max="6"
                value={count}
                onChange={event => {
                    setCount(Number(event.target.value));
                }}
            />
            <div>{count >= 1 && count <= 6 && <AlsButton text={'Start game'} onAction={() => {}} />}</div>
        </div>
    );
};
