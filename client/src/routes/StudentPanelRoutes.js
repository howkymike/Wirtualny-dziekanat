import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';


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


            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default StudentPanelRoutes;
