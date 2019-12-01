import * as React from 'react';
import { MainPage } from 'als-pages/MainPage';
import { GamePage } from 'als-pages/GamePage';
import { SelectTeamPage } from 'als-pages/SelectTeamPage';
import { TeamsPage } from 'als-pages/TeamsPage';
import { WordsPage } from 'als-pages/WordsPage';
import { RoundResultsPage } from 'als-pages/RoundResultsPage';
import { Loader } from 'als-components/Loader';

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
        path: '/teams/:gameUid',
        component: TeamsPage,
    },
    {
        path: '/results/:resultUid',
        component: RoundResultsPage,
    },
    {
        path: '/game/:gameUid',
        component: GamePage,
    },
    {
        path: '/words',
        component: WordsPage,
    },
    {
        path: '/loading',
        component: Loader,
    },
];

export default routes;
