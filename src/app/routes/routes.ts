import * as React from 'react';
import { MainPage } from 'als-pages/MainPage';
import { GamePage } from 'als-pages/GamePage';
import { SelectTeamPage } from 'als-pages/SelectTeamPage';

interface IRoute {
    path: string;
    component: React.FC<any>;
}

const routes: IRoute[] = [
    {
        path: '/',
        component: MainPage,
    },
    {
        path: '/select-teams/:gameUid',
        component: SelectTeamPage,
    },
    {
        path: '/game/:gameUid',
        component: GamePage,
    },
];

export default routes;
