import { createContext } from 'react';
import { IHeaderProps } from 'als-components/Header';

export interface IAppContext {
    hideHeader: () => void;
    showHeader: () => void;
    setHeaderProps: (props: IHeaderProps) => void;
}

const context: IAppContext = {
    hideHeader: () => console.info('hideHeader was not setup'),
    showHeader: () => console.info('showHeader was not setup'),
    setHeaderProps: (props: IHeaderProps) => console.info(props, 'setHeaderProps was not setup'),
};

export const AppContext = createContext<IAppContext>(context);
