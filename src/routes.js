import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './components/NotFound';

import Home from './view/Home';
import Admin from './view/Admin';
import AdminCategory from './view/AdminCategory';
import ActivityDetails from './view/ActivityDetails';

const AppRoutes = (props) =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/category" component={AdminCategory} />
        <Route exact path="/activityDetail/:id([0-9]+)" component={ActivityDetails} />

        <Route component={NotFound} />
    </Switch>
;

export default AppRoutes;
