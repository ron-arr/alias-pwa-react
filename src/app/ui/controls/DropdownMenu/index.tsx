import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';

const cn = classNameBuilder('dropdown-menu');

type TOptionValue = number | string;
export type TOptionDropdown<T = TOptionValue> = {
    title: string;
    value: T;
};

interface IProps<T> {
    title: string;
    items: T[];
    closeOnSelect?: boolean;
    onSelect: (value: T) => void;
}

export const DropdownMenu = <T extends TOptionValue | TOptionDropdown>({ title, items, closeOnSelect, onSelect }: IProps<T>) => {
    const [open, setOpen] = React.useState(false);
    const select = (index: number) => {
        return (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onSelect(items[index]);
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
                        {items.map((item: TOptionValue | TOptionDropdown, index: number) => (
                            <li key={index} className={cn('item')}>
                                <a className={cn('item-link')} href="#" onClick={select(index)}>
                                    {typeof item === 'object' ? item.title : item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
};
