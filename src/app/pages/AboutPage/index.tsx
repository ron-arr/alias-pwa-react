import './styles.scss';
import React, { useState, useEffect, useContext } from 'react';
import { classNameBuilder } from 'als-services/className';
import { GameSettings } from 'als-models';
import { IAppContext, AppContext } from 'als-contexts/app';

const cn = classNameBuilder('main');

export const AboutPage: React.FC = () => {
    const context = useContext<IAppContext>(AppContext);
    useEffect(() => {
        context.showHeader();
        context.setHeaderProps({ title: 'О приложении' });
    }, []);

    let settings = new GameSettings();
    return <div className={cn()}>Пока пусто</div>;
};
