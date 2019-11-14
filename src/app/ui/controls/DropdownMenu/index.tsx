import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';

const cn = classNameBuilder('dropdown-menu');

interface IProps {
    title: string;
    items: (string | number)[];
    closeOnSelect?: boolean;
    onSelect: (index: number) => void;
}

export const DropdownMenu: React.FC<IProps> = ({ title, items, closeOnSelect, onSelect }) => {
    const [open, setOpen] = React.useState(false);
    const select = (index: number) => {
        return (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onSelect(index);
            if (closeOnSelect) {
                setOpen(false);
            }
        };
    };
    const handleCheckChange = () => {
        setOpen(!open);
    };
    return (
        <div className={cn()}>
            <ul className={cn('list')}>
                <li className={cn('dropdown')}>
                    <input className={cn('check')} type="checkbox" checked={open} onChange={handleCheckChange} />
                    <a className={cn('toggle')} href="#" data-toggle="dropdown">
                        {title}
                    </a>
                    <ul className={cn('items')}>
                        {items.map((item, index) => (
                            <li key={index} className={cn('item')}>
                                <a className={cn('item-link')} href="#" onClick={select(index)}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
};
