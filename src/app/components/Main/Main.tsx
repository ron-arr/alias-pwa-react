import * as React from 'react';
import { useState } from 'react';
import { User } from 'components/User';
import { AlsInput, AlsButton } from 'ui/controls';

interface IProps {
    compiler: string;
    framework: string;
}

export const Main: React.FC<IProps> = (props: IProps) => {
    const [count, setCount] = useState(2);

    return (
        <div>
            <h1>
                Hello from {props.compiler} and {props.framework}!!
            </h1>
            <User />
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
