import './style.scss';
import * as React from 'react';
import { classNameBuilder } from 'services/className';

interface IProps {
    text: string;
    onAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const cn = classNameBuilder('button');

export const Button: React.FC<IProps> = ({ text, onAction }: IProps) => {
    return (
        <button className={cn()} onClick={onAction}>
            <span>{text}</span>
        </button>
    );
};
