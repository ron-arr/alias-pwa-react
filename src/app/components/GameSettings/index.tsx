import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'services/className';
import { DropdownMenu } from 'ui/controls/DropdownMenu';

const TEAM_BASE_TITLE = 'Количество команд';
const LEVEL_BASE_TITLE = 'Уровень';
const cn = classNameBuilder('game-settings');

export const GameSettings: React.FC = () => {
    const [teamsCnt, setTeamsCount] = React.useState(2);
    const [teamTitle, setTeamTitle] = React.useState(`${TEAM_BASE_TITLE}: ${teamsCnt}`);
    const [level, setLevel] = React.useState('Простой');
    const [levelTitle, setLevelTitle] = React.useState(`${LEVEL_BASE_TITLE}: ${level}`);

    const teamsCount = [2, 3, 4, 5, 6];
    const levels = ['Простой', 'Нормальный', 'Сложный'];
    return (
        <div className={cn()}>
            <DropdownMenu
                title={teamTitle}
                items={teamsCount}
                closeOnSelect={true}
                onSelect={index => {
                    setTeamsCount(teamsCount[index]);
                    setTeamTitle(`${TEAM_BASE_TITLE}: ${teamsCount[index]}`);
                }}
            />
            <DropdownMenu
                title={levelTitle}
                items={levels}
                closeOnSelect={true}
                onSelect={index => {
                    setLevel(levels[index]);
                    setLevelTitle(`${LEVEL_BASE_TITLE}: ${levels[index]}`);
                }}
            />
        </div>
    );
};
