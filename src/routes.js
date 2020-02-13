import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './components/NotFound';

import Home from './view/Home';
import Admin from './view/Admin';

const AppRoutes = (props) =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route component={NotFound} />
    </Switch>
;

export default AppRoutes;
