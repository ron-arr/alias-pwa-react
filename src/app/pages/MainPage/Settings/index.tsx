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
const POINT_COUNTS_TITLE = 'Количество очков';

const cn = classNameBuilder('game-settings');

export type TUpdateSettings = <K extends keyof GameSettings, T extends GameSettings[K]>(fieldName: K, value: T) => void;

interface IProps {
    settings: GameSettings;
    onChangeSettings: TUpdateSettings;
    disabled?: boolean;
}

export const Settings: React.FC<IProps> = ({ settings, onChangeSettings, disabled }) => {
    const [teamTitle, setTeamTitle] = useState(`${TEAM_BASE_TITLE}: ${settings.teamsCount}`);
    const [levelTitle, setLevelTitle] = useState(`${LEVEL_BASE_TITLE}: ${settings.levelTitle}`);
    const [roundDurTitle, setRoundDurTitle] = useState(`${ROUND_DUR_BASE_TITLE}: ${settings.roundTimeTitle}`);
    const [pointCountsTitle, setPointCounts] = useState(`${POINT_COUNTS_TITLE}: ${settings.pointCounts}`);

    return (
        <div className={cn()}>
            <DropdownMenu
                disabled={disabled}
                title={teamTitle}
                items={GameSettings.getTeamsCount()}
                closeOnSelect={true}
                onSelect={teamsCount => {
                    onChangeSettings('teamsCount', teamsCount);
                    setTeamTitle(`${TEAM_BASE_TITLE}: ${teamsCount}`);
                }}
            />
            <DropdownMenu<TOptionDropdown<TLevel>>
                disabled={disabled}
                title={levelTitle}
                items={GameSettings.getLevels()}
                closeOnSelect={true}
                onSelect={level => {
                    onChangeSettings('level', level.value);
                    setLevelTitle(`${LEVEL_BASE_TITLE}: ${level.title}`);
                }}
            />
            <DropdownMenu<TOptionDropdown<TRoundTime>>
                disabled={disabled}
                title={roundDurTitle}
                items={GameSettings.getRoundTimes()}
                closeOnSelect={true}
                onSelect={roundTime => {
                    onChangeSettings('roundTime', roundTime.value);
                    setRoundDurTitle(`${ROUND_DUR_BASE_TITLE}: ${roundTime.title}`);
                }}
            />
            <DropdownMenu
                disabled={disabled}
                title={pointCountsTitle}
                items={GameSettings.getPointCounts()}
                closeOnSelect={true}
                onSelect={pointCounts => {
                    onChangeSettings('pointCounts', pointCounts);
                    setPointCounts(`${POINT_COUNTS_TITLE}: ${pointCounts}`);
                }}
            />
        </div>
    );
};
