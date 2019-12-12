import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { AddToHomeScreenBtn } from 'als-pages/MainPage/AddToHomeScreenBtn';
import { Link, useLocation } from 'react-router-dom';

const cn = classNameBuilder('drawer');
const items = [
    {
        title: 'Новая игра',
        path: '/',
    },
    {
        title: 'Правила',
        path: '/rules',
    },
    {
        title: 'О приложении',
        path: '/about',
    },
];

export const Drawer: React.FC = () => {
    const location = useLocation();
    return (
        <div className={cn('')}>
            <input className={cn('toggle')} type="checkbox" id="drawer-toggle" />
            <label className={cn('toggle-label')} htmlFor="drawer-toggle" id="drawer-toggle-label"></label>
            <nav className={cn('menu')}>
                <ul className={cn('list')}>
                    {items.map((item, index) => (
                        <li key={index} className={cn('item', { current: location.pathname === item.path })}>
                            <Link replace={true} to={item.path}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                    <li className={cn('item', {'add2hs': true})}>
                        <AddToHomeScreenBtn />
                    </li>
                </ul>
            </nav>
        </div>
    );
};
