import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps } from 'react-router-dom';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match }: IProps) => {
    console.log('match', match);

    return <div className={cn()}>Helloww! {match.params.gameUid}</div>;
};
