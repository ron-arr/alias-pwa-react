import React from 'react';
import { MainPage } from 'als-pages/MainPage';

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
        component: React.lazy(() => import('als-pages/SelectTeamPage').then(module => ({ default: module.SelectTeamPage }))),
    },
    {
        path: '/teams/:gameUid',
        component: React.lazy(() => import('als-pages/TeamsPage').then(module => ({ default: module.TeamsPage }))),
    },
    {
        path: '/results/:resultUid',
        component: React.lazy(() => import('als-pages/RoundResultsPage').then(module => ({ default: module.RoundResultsPage }))),
    },
    {
        path: '/game/:gameUid',
        component: React.lazy(() => import('als-pages/GamePage').then(module => ({ default: module.GamePage }))),
    },
    {
        path: '/words',
        component: React.lazy(() => import('als-pages/WordsPage').then(module => ({ default: module.WordsPage }))),
    },
    {
        path: '/loading',
        component: React.lazy(() => import('als-components/Loader').then(module => ({ default: module.Loader }))),
    },
];

export default routes;
