import { Route, Switch } from "react-router";

import Login from '../pages/Login';
import ForgetPassword from "../pages/ForgetPassword";
import ChangePassword from "../pages/ChangePassword";
import FirstTime from '../pages/FirstTime';
import PageNotFound from '../pages/PageNotFound';


const AuthRoutes = props => {

    return (
        <Switch>
            <Route exact path="/login">
                <Login />
            </Route>

            <Route exact path="/forgetPassword">
                <ForgetPassword />
            </Route>

            <Route exact path="/changePassword/:token">
                <ChangePassword />
            </Route>

            <Route exact path="/firsttime/:token">
                <FirstTime />
            </Route>

            { /* Page not found */ }
            <Route path="*">
                <PageNotFound />
            </Route>
        </Switch>
    );

};


export default AuthRoutes;