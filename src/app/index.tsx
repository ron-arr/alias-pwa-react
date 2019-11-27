import 'styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { routes } from './routes';
import { browserHistory } from 'als-routes/browserHistory';

const route = () => (
    <Router history={browserHistory}>
        {routes.map((routeProps, index) => (
            <Route key={index} exact {...routeProps} />
        ))}
    </Router>
);

ReactDOM.render(route(), document.getElementById('c-als-content'));
