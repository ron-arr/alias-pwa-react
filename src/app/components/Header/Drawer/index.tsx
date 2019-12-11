import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { AddToHomeScreenBtn } from 'als-pages/MainPage/AddToHomeScreenBtn';

const cn = classNameBuilder('drawer');

export const Drawer: React.FC = () => {
    const handle = (event: any) => console.log('checked', event.target.checked);
    return (
        <>
            <input className={cn('toggle')} type="checkbox" id="drawer-toggle" onChange={handle} />
            <label className={cn('toggle-label')} htmlFor="drawer-toggle" id="drawer-toggle-label"></label>
            <nav className={cn('menu')}>
                <ul className={cn('list')}>
                    <li>
                        <AddToHomeScreenBtn />
                    </li>
                </ul>
            </nav>
        </>
    );
};
