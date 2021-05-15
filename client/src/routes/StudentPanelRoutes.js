import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';
import StudentCourse from "../pages/StudentCourse";
import CourseOfStudies from "../pages/CourseOfStudies";

const StudentPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Summary type="student" />
            </Route>

            { /* TODO: Add student routes */ }

            <Route exact path={`${path}/changeactualpassword`}>
                <ChangeActualPassword />
            </Route>

            <Route exact path={`${path}/course-of-studies`}>
                <CourseOfStudies />
            </Route>

            <Route exact path={`${path}/course`}>
                <StudentCourse />
            </Route>

            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default StudentPanelRoutes;
