import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';
import Courses from '../pages/clerk/Courses';
import StudentList from "../pages/StudentList";

const ClerkPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Summary type="clerk" />
            </Route>

            <Route exact path={`${path}/courses`}>
                <Courses />
            </Route>

            <Route exact path={`${path}/students`}>
                <StudentList semesterFilter={true} />
            </Route>

            <Route exact path={`${path}/changeactualpassword`}>
                <ChangeActualPassword />
            </Route>

            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default ClerkPanelRoutes;
