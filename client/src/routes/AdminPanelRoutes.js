import { Switch, Route, useRouteMatch } from 'react-router';

import PlatformInfo from '../pages/PlatformInfo';
import StudentList from '../pages/StudentList';
import PageNotFound from '../pages/PageNotFound';


const AdminPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                { /* Admin home */ }
            </Route>
            
            <Route exact path={`${path}/platform`}>
                <PlatformInfo />
            </Route>

            <Route exact path={`${path}/list`}>
                <StudentList />
            </Route>

            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>

        </Switch>
    );
};


export default AdminPanelRoutes;
