import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';
import LecturerCourse from '../pages/LecturerCourse';
import Reports from '../pages/Reports'

const LecturerPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Summary type="lecturer" />
            </Route>

            { /* TODO: Add lecturer routes */ }

            <Route exact path={`${path}/changeactualpassword`}>
                <ChangeActualPassword />
            </Route>


            <Route exact path={`${path}/course`}>
                <LecturerCourse />
            </Route>

            <Route exact path={`${path}/reports`}>
                <Reports />
            </Route>

            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default LecturerPanelRoutes;
