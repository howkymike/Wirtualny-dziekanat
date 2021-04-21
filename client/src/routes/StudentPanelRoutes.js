import { Switch, Route, useRouteMatch } from 'react-router';

import PageNotFound from '../pages/PageNotFound';


const StudentPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                { /* Student home */ }
            </Route>

            { /* TODO: Add student routes */ }


            { /* Page not found */ }
            <Route path="*">
                <PageNotFound/>
            </Route>
        </Switch>
    );
};


export default StudentPanelRoutes;
