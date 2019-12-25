import './style.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';

type TButtonType = 'primary' | 'secondary';

interface IProps {
    text: string;
    className?: string;
    type?: TButtonType;
    disabled?: boolean;
    size?: 'small' | 'norm';
    onAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const cn = classNameBuilder('button');

export const Button: React.FC<IProps> = ({ text, className, type, disabled, size, onAction }: IProps) => {
    type = type || 'primary';
    size = size || 'norm';

    return (
        <button className={cn('', { [type]: true, [size]: true }, [className])} onClick={onAction} disabled={disabled}>
            <span>{text}</span>
        </button>
    );
};
