import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { Team } from 'als-models';

interface IProps {
    team: Team;
    className?: string;
}
const cn = classNameBuilder('cards');

const words = ['неплатёжеспособность', 'баггист', 'воссоединение', 'передислокация', 'гарантия', 'уторщик'];

export const Cards: React.FC<IProps> = ({ className, team }: IProps) => {
    const [index, setIndex] = useState(0);

    const handleAccept = () => {
        if (index === words.length - 1) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    };

    const word = words[index];
    return (
        <div className={cn('', [className])}>
            <div className={cn('accept')}>
                <button className={cn('result-title', { accept: true })} onClick={handleAccept}>
                    Верно
                </button>
            </div>
            <div className={cn('wrapper')}>
                <div className={cn('word', { tldr: word.length > 14 })}>{word}</div>
            </div>
            <div className={cn('skip')}>
                <button className={cn('result-title', { skip: true })} onClick={handleAccept}>
                    Пропустить
                </button>
            </div>
        </div>
    );
};
