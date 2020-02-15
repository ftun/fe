import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './components/NotFound';

import Home from './view/Home';
import Admin from './view/Admin';
import AdminCategory from './view/AdminCategory';
import ActivityDetails from './view/ActivityDetails';
import InfoActivities from './view/InfoActivities';

const AppRoutes = (props) =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/category" component={AdminCategory} />
        <Route exact path="/activityDetail/:id([0-9]+)" component={ActivityDetails} />
        <Route exact path="/activitiesInfo/:id([0-9]+)" component={InfoActivities} />

        <Route component={NotFound} />
    </Switch>
;

export default AppRoutes;
