import * as React from 'react';
import * as s from './style.scss';

interface IProps {
    text: string;
    onAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<IProps> = ({ text, onAction }: IProps) => {
    return (
        <button className={s.button} onClick={onAction}>
            <span>{text}</span>
        </button>
    );
};
