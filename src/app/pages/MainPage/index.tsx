import './styles.scss';
import React from 'react';
import { Button } from 'als-ui/controls';
import { Settings } from 'als-pages/MainPage/Settings';
import { classNameBuilder } from 'als-services/className';
import { useHistory } from 'react-router-dom';
import { GameSettings } from 'als-models';
import { gameRepo } from 'als-db';

interface IProps {}

const cn = classNameBuilder('main');

const handleStart = (settings: GameSettings) => {
    const history = useHistory();
    return () => {
        const game = settings.createGame();
        gameRepo.save(game).then(() => {
            history.push(`/select-teams/${game.uid}`);
        });
    };
};

export const MainPage: React.FC<IProps> = (props: IProps) => {
    let settings = new GameSettings();
    return (
        <div className={cn()}>
            <div className={cn('title')}>Alias</div>
            <Settings
                settings={settings}
                onChangeSettings={(fieldName, value) => {
                    settings[fieldName] = value;
                }}
            />
            <Button className={cn('btn')} text={'Продолжить'} type="secondary" onAction={handleStart(settings)} />
        </div>
    );
};
