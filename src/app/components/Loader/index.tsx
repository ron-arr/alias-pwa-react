import './styles.scss';
import  React from 'react';
import { classNameBuilder } from 'als-services/className';
const cn = classNameBuilder('loader');

export const Loader: React.FC = () => (
    <div className={cn()}>
        <div className={cn('box')}>
            <span className={cn('border')}></span>
            <h1>
                <span>Alias</span> 
            </h1>
        </div>
    </div>
);
