import './styles.scss';
import React, { useState } from 'react';
import { classNameBuilder } from 'als-services/className';
import { DropdownMenu } from 'als-ui/controls';
import { GameSettings } from 'als-models';
import { TOptionDropdown } from 'als-ui/controls/DropdownMenu';
import { TLevel, TRoundTime } from 'als-data-types/game';

const TEAM_BASE_TITLE = 'Количество команд';
const LEVEL_BASE_TITLE = 'Уровень';
const ROUND_DUR_BASE_TITLE = 'Время раунда';

const cn = classNameBuilder('game-settings');

export type TUpdateSettings = <K extends keyof GameSettings, T extends GameSettings[K]>(fieldName: K, value: T) => void;

interface IProps {
    settings: GameSettings;
    onChangeSettings: TUpdateSettings;
}

export const Settings: React.FC<IProps> = ({ settings, onChangeSettings }) => {
    const [teamTitle, setTeamTitle] = useState(`${TEAM_BASE_TITLE}: ${settings.teamsCount}`);
    const [levelTitle, setLevelTitle] = useState(`${LEVEL_BASE_TITLE}: ${settings.levelTitle}`);
    const [roundDurTitle, setRoundDurTitle] = useState(`${ROUND_DUR_BASE_TITLE}: ${settings.roundTimeTitle}`);

    return (
        <div className={cn()}>
            <DropdownMenu
                title={teamTitle}
                items={GameSettings.getTeamsCount()}
                closeOnSelect={true}
                onSelect={teamsCount => {
                    onChangeSettings('teamsCount', teamsCount);
                    setTeamTitle(`${TEAM_BASE_TITLE}: ${teamsCount}`);
                }}
            />
            <DropdownMenu<TOptionDropdown<TLevel>>
                title={levelTitle}
                items={GameSettings.getLevels()}
                closeOnSelect={true}
                onSelect={level => {
                    onChangeSettings('level', level.value);
                    setLevelTitle(`${LEVEL_BASE_TITLE}: ${level.title}`);
                }}
            />
            <DropdownMenu<TOptionDropdown<TRoundTime>>
                title={roundDurTitle}
                items={GameSettings.getRoundTimes()}
                closeOnSelect={true}
                onSelect={roundTime => {
                    onChangeSettings('roundTime', roundTime.value);
                    setRoundDurTitle(`${ROUND_DUR_BASE_TITLE}: ${roundTime.title}`);
                }}
            />
        </div>
    );
};
