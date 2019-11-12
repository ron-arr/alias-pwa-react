import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'services/className';
import { DropdownMenu } from 'ui/controls/DropdownMenu';

const cn = classNameBuilder('game-settings');

export const GameSettings: React.FC = () => {
    const baseTitle = 'Количество команд';
    const [teamsCnt, setTeamsCount] = React.useState(2);
    const [title, setTitle] = React.useState(`${baseTitle}: ${teamsCnt}`);

    const items = [2, 3, 4, 5, 6];
    return (
        <div className={cn()}>
            <DropdownMenu
                title={title}
                items={items}
                closeOnSelect={true}
                onSelect={index => {
                    setTeamsCount(items[index]);
                    setTitle(`${baseTitle}: ${items[index]}`);
                }}
            />
        </div>
    );
};
