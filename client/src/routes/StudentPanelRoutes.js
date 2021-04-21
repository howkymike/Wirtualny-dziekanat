import { Switch, Route, useRouteMatch } from 'react-router';


const StudentPanelRoutes = props => {

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                { /* Student home */ }
            </Route>
        </Switch>
    );
};


export default StudentPanelRoutes;
