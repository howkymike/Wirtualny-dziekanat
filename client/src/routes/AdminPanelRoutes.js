import { Switch, Route, useRouteMatch } from 'react-router';

import PlatformInfo from '../pages/PlatformInfo';
import StudentList from '../pages/StudentList';


const AdminPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                { /* Admin home */ }
            </Route>
            <Route path={`${path}/platform`}>
                <PlatformInfo />
            </Route>

            <Route path={`${path}/list`}>
                <StudentList />
            </Route>
        </Switch>
    );
};


export default AdminPanelRoutes;
