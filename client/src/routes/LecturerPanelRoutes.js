import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';
import ChangeActualPassword from '../pages/ChangeActualPassword';
import Summary from '../pages/Summary';

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


            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default LecturerPanelRoutes;
