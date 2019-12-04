import './styles.scss';
import  React from 'react';
import { classNameBuilder } from 'als-services/className';

const cn = classNameBuilder('curtain');

export const Curtain: React.FC = () => {
    return <div className={cn()}></div>;
};
