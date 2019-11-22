import './styles.scss';
import * as React from 'react';
import { classNameBuilder } from 'als-services/className';
import { RouteComponentProps } from 'react-router-dom';
import { Header } from 'als-ui';
import { db } from 'als-db';

interface IRouterProps {
    gameUid: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {}
const cn = classNameBuilder('game');

export const GamePage: React.FC<IProps> = ({ match }: IProps) => {
    db.collection('words')
        .add({
            value: 'test',
        })
        .then(docRef => console.log(docRef))
        .catch(err => console.error(err));
    return (
        <div className={cn()}>
            <Header title="Первый раунд" />
        </div>
    );
};
