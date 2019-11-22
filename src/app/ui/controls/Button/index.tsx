import './style.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';

type TButtonType = 'primary' | 'secondary';

interface IProps {
    text: string;
    type?: TButtonType;
    disabled?: boolean;
    onAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const cn = classNameBuilder('button');

export const Button: React.FC<IProps> = ({ text, type, disabled, onAction }: IProps) => {
    type = type || 'primary';

    return (
        <button className={cn('', { [type]: true })} onClick={onAction} disabled={disabled}>
            <span>{text}</span>
        </button>
    );
};
