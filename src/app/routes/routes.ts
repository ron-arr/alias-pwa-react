import React, { lazy } from 'react';
import { MainPage } from 'als-pages/MainPage';
import { RouteProps } from 'react-router-dom';

export interface IRoute extends RouteProps {
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
        component: lazy(() => import('als-pages/SelectTeamPage').then(module => ({ default: module.SelectTeamPage }))),
    },
    {
        path: '/teams/:gameUid',
        component: lazy(() => import('als-pages/TeamsResultPage').then(module => ({ default: module.TeamsPage }))),
    },
    {
        path: '/results/:resultUid',
        component: lazy(() => import('als-pages/RoundResultsPage').then(module => ({ default: module.RoundResultsPage }))),
    },
    {
        path: '/game/:gameUid',
        component: lazy(() => import('als-pages/GamePage').then(module => ({ default: module.GamePage }))),
    },
    {
        path: '/words',
        component: lazy(() => import('als-pages/WordsPage').then(module => ({ default: module.WordsPage }))),
    },
    {
        path: '/loading',
        component: lazy(() => import('als-components/Loader').then(module => ({ default: module.Loader }))),
    },
    {
        path: '/rules',
        component: lazy(() => import('als-pages/RulesPage').then(module => ({ default: module.RulesPage }))),
    },
    {
        path: '/about',
        component: lazy(() => import('als-pages/AboutPage').then(module => ({ default: module.AboutPage }))),
    },
];

export default routes;
