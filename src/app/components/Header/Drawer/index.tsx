import './styles.scss';
import React from 'react';
import { classNameBuilder } from 'als-services/className';
import { AddToHomeScreenBtn } from 'als-components/AddToHomeScreenBtn';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { GameSettings } from 'als-models';
import { BackCurrentGameLink } from './BackCurrentGameLink';
import { ShareLink } from './ShareLink';

type TMenuItem = {
    title: string;
    path: string;
    state?: object;
};

interface IProps {
    path: string;
}

const cn = classNameBuilder('drawer');
const items: TMenuItem[] = [
    {
        title: 'Правила',
        path: '/rules',
    },
    {
        title: 'О приложении',
        path: '/about',
    },
];

export const Drawer: React.FC<IProps> = ({ path }: IProps) => {
    const drawer = document.getElementById('c-als-drawer');
    const gameUid = GameSettings.getCurrentGameUid();
    const gameStartPaths = ['/teams', '/results', '/game'];

    return ReactDOM.createPortal(
        <div className={cn('')}>
            <input className={cn('toggle')} type="checkbox" id="drawer-toggle" />
            <label className={cn('toggle-label')} htmlFor="drawer-toggle" id="drawer-toggle-label"></label>
            <nav className={cn('menu')}>
                <ul className={cn('list')}>
                    {path !== '/' && (
                        <li className={cn('item')}>
                            <Link replace={true} to="/">
                                Новая игра
                            </Link>
                        </li>
                    )}
                    {items.map((item, index) => (
                        <li key={index} className={cn('item', { current: path === item.path })}>
                            <Link replace={true} to={item.path}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                    {gameUid && gameStartPaths.every(startPath => !path.startsWith(startPath)) ? (
                        <li className={cn('item')}>
                            <BackCurrentGameLink />
                        </li>
                    ) : (
                        gameUid && (
                            <li className={cn('item')}>
                                <ShareLink gameUid={gameUid} />
                            </li>
                        )
                    )}
                    <li className={cn('item', { add2hs: true })}>
                        <AddToHomeScreenBtn />
                    </li>
                </ul>
            </nav>
        </div>,
        drawer as HTMLElement
    );
};
