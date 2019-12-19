import React from 'react';
import { GameSettings } from 'als-models';
import { Link } from 'react-router-dom';

export const CurrentGameItem: React.FC = () => {
    const gameData = GameSettings.getCurrentGame();
    if (gameData) {
        return (
            <Link replace={true} to={{ pathname: `/teams/${gameData.uid}`, state: { ...gameData } }}>
                Вернуться в игру
            </Link>
        );
    }
    return null;
};
