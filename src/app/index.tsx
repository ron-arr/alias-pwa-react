import 'styles/index.scss';
import React, { Suspense, useState } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { routes } from './routes';
import { Loader } from 'als-components/Loader';
import { Header, IHeaderProps } from 'als-components/Header';
import { IAppContext, AppContext } from 'als-contexts/app';

interface IContextWrapperProps {
    children: React.ReactNode;
}

const ContextWrapper = ({ children }: IContextWrapperProps) => {
    const [showHeader, setShowHeader] = useState(false);
    const [headerProps, setHeaderProps] = useState<IHeaderProps>({
        title: '',
    });
    const context: IAppContext = {
        hideHeader: () => setShowHeader(false),
        showHeader: () => setShowHeader(true),
        setHeaderProps: setHeaderProps,
    };
    return (
        <>
            {showHeader && <Header {...headerProps} />}
            <AppContext.Provider value={context}>{children}</AppContext.Provider>
        </>
    );
};

const renderRoute = (Component: React.FC<any>) => {
    return (props: RouteComponentProps<any>) => {
        return (
            <ContextWrapper>
                <Component {...props} />
            </ContextWrapper>
        );
    };
};

const App: React.FC = () => {
    console.log('App');
    return (
        <BrowserRouter>
            {routes.map(({ component: Component, ...routeProps }, index) => {
                const renderFn = renderRoute(Component);
                return (
                    <Suspense key={index} fallback={<Loader />}>
                        <Route exact {...routeProps} render={renderFn} />
                    </Suspense>
                );
            })}
        </BrowserRouter>
    );
};

ReactDOM.render(<App />, document.getElementById('c-als-content'));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

window.addEventListener('load', function() {
    window.history.pushState({ noBackExitsApp: true }, '');
});

window.addEventListener('popstate', function(event) {
    console.log('event.state', event.state)
    if (event.state && event.state.noBackExitsApp) {
        window.history.pushState({ noBackExitsApp: true }, '');
    }
});
