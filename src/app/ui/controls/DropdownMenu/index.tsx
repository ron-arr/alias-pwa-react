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
    const handleSelect = (index: number) => {
        return (event: React.MouseEvent<HTMLButtonElement>) => {
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
                    <button className={cn('toggle', { open: open })} data-toggle="dropdown" onClick={handleCheckChange}>
                        {title}
                    </button>
                    <ul className={cn('items')}>
                        {items.map((item: TOptionValue | TOptionDropdown, index: number) => (
                            <li key={index} className={cn('item')}>
                                <button className={cn('item-btn')} onClick={handleSelect(index)}>
                                    {typeof item === 'object' ? item.title : item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
};
