import 'styles/index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { routes } from './routes';
import { browserHistory } from 'als-routes/browserHistory';
import { Loader } from 'als-components/Loader';

const route = () => (
    <Router history={browserHistory}>
        {routes.map((routeProps, index) => (
            <Suspense key={index} fallback={<Loader />}>
                <Route exact {...routeProps} />
            </Suspense>
        ))}
    </Router>
);

ReactDOM.render(route(), document.getElementById('c-als-content'));
