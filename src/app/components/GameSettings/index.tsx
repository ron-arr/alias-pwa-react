import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { DropdownMenu } from 'als-ui/controls';

const TEAM_BASE_TITLE = 'Количество команд';
const LEVEL_BASE_TITLE = 'Уровень';
const ROUND_DUR_BASE_TITLE = 'Время раунда';
const cn = classNameBuilder('game-settings');

interface IProps {
    onChangeTeamsCnt: (value: number) => void;
}

export const GameSettings: React.FC<IProps> = ({ onChangeTeamsCnt }) => {
    const [teamsCnt, setTeamsCount] = React.useState(2);
    const [teamTitle, setTeamTitle] = React.useState(`${TEAM_BASE_TITLE}: ${teamsCnt}`);
    const [level, setLevel] = React.useState('Простой');
    const [levelTitle, setLevelTitle] = React.useState(`${LEVEL_BASE_TITLE}: ${level}`);
    const [roundDur, setRoundDur] = React.useState('1 мин');
    const [roundDurTitle, setRoundDurTitle] = React.useState(`${ROUND_DUR_BASE_TITLE}: ${roundDur}`);

    const teamsCount = [2, 3, 4, 5, 6];
    const levels = ['Простой', 'Нормальный', 'Сложный'];
    const roundDurs = ['1 мин', '2 мин', '3 мин'];
    return (
        <div className={cn()}>
            <DropdownMenu
                title={teamTitle}
                items={teamsCount}
                closeOnSelect={true}
                onSelect={index => {
                    setTeamsCount(teamsCount[index]);
                    onChangeTeamsCnt(teamsCount[index]);
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
            <DropdownMenu
                title={roundDurTitle}
                items={roundDurs}
                closeOnSelect={true}
                onSelect={index => {
                    setRoundDur(roundDurs[index]);
                    setRoundDurTitle(`${ROUND_DUR_BASE_TITLE}: ${roundDurs[index]}`);
                }}
            />
        </div>
    );
};
