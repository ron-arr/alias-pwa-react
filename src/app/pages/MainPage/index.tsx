import './styles.scss';
import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'als-ui/controls';
import { Settings } from 'als-pages/MainPage/Settings';
import { classNameBuilder } from 'als-services/className';
import { useHistory } from 'react-router-dom';
import { GameSettings } from 'als-models';
import { Curtain } from 'als-components/Curtain';
import { AddToHomeScreenBtn } from './AddToHomeScreenBtn';
import { LogoIcon } from 'als-icons/otherIcons';
import { IAppContext, AppContext } from 'als-contexts/app';

const cn = classNameBuilder('main');

export const MainPage: React.FC = () => {
    const context = useContext<IAppContext>(AppContext);
    const [disabled, setDisabled] = useState(false);
    const history = useHistory();
    useEffect(() => {
        context.showHeader();
    }, []);

    const handleStart = () => {
        setDisabled(true);
        const game = settings.createGame();
        history.replace(`/select-teams/${game.uid}`, { gameData: game.toJson() });
    };
    let settings = new GameSettings();
    return (
        <div className={cn()}>
            <LogoIcon className={cn('logo')} width={200} height={100} />
            {/* <AddToHomeScreenBtn /> */}
            {disabled && <Curtain />}
            <Settings
                disabled={disabled}
                settings={settings}
                onChangeSettings={(fieldName, value) => {
                    settings[fieldName] = value;
                }}
            />
            <Button disabled={disabled} className={cn('btn')} text={'Продолжить'} type="secondary" onAction={handleStart} />
        </div>
    );
};
