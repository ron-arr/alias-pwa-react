import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';

const cn = classNameBuilder('check-flip');

interface IProps {
    id: number;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const CheckFlip: React.FC<IProps> = ({ id, value, onChange }) => {
    const [checked, setChecked] = useState(value);
    const checkId = `check-flip-${id}`;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        onChange(event.target.checked);
    };
    return (
        <>
            <input id={checkId} className={cn()} type="checkbox" onChange={handleChange} checked={checked} />
            <label htmlFor={checkId} className={cn('tgl-btn')} data-tg-on="Да!" data-tg-off="Нет"></label>
        </>
    );
};
