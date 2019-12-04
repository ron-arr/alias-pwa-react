import './styles.scss';
import  React from 'react';
import { classNameBuilder } from 'als-services/className';

interface IProps {
    title: string;
}
const cn = classNameBuilder('header');

export const Header: React.FC<IProps> = ({ title }: IProps) => {
    return (
        <div className={cn()}>
            <h1 className={cn('title')}>{title}</h1>
        </div>
    );
};
