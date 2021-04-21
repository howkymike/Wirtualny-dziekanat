import { Switch, Route, useRouteMatch } from 'react-router';

import PlatformInfo from '../pages/PlatformInfo';
import StudentList from '../pages/StudentList';
import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';


const AdminPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <Summary type="admin" />
            </Route>
            
            <Route exact path={`${path}/platform`}>
                <PlatformInfo />
            </Route>

            <Route exact path={`${path}/list`}>
                <StudentList />
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


export default AdminPanelRoutes;
