import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';

const cn = classNameBuilder('check-flip');

interface IProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const CheckFlip: React.FC<IProps> = ({ value, onChange }) => {
    const [checked, setChecked] = useState(value);
    const id = `check-flip-${Date.now()}`;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    return (
        <>
            <input id={id} className={cn()} type="checkbox" onChange={handleChange} checked={checked} />
            <label className={cn('tgl-btn')} htmlFor={id} data-tg-on="Да!" data-tg-off="Нет"></label>
        </>
    );
};
