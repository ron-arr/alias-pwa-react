import * as React from 'react';
import { MainPage } from 'als-pages/MainPage';
import { GamePage } from 'als-pages/GamePage';
import { SelectTeamPage } from 'als-pages/SelectTeamPage';
import { ResultsPage } from 'als-pages/ResultsPage';
import { WordsPage } from 'als-pages/WordsPage';

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
        path: '/results/:gameUid',
        component: ResultsPage,
    },
    {
        path: '/game/:gameUid',
        component: GamePage,
    },
    {
        path: '/words',
        component: WordsPage,
    },
];

export default routes;
