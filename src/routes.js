import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import NotFound from './components/NotFound';

const AppRoutes = (props) =>
    <Switch>
        <Route exact path="/" component={App} />
        <Route component={NotFound} />
    </Switch>
;

export default AppRoutes;
