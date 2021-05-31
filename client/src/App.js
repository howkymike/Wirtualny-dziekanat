import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserProvider } from './context/userContext';

import Nav from './components/Nav';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import FirstTime from './pages/FirstTime';
import ForgetPassword from './pages/ForgetPassword';
import ChangePassword from './pages/ChangePassword';
import AdminPanelRoutes from './routes/AdminPanelRoutes';
import AuthRoutes from './routes/AuthRoutes';
import StudentPanelRoutes from './routes/StudentPanelRoutes';
import ClerkPanelRoutes from './routes/ClerkPanelRoutes';
import LecturerPanelRoutes from './routes/LecturerPanelRoutes';
import Logo from './components/Logo';

const Landing = styled.div`
    background-image:url(agh_1.jpg);
    background-attachment:inherit;
    background-position:50% 50%;
    background-repeat:no-repeat;
    background-size:cover;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;

    &::before {
        content:'';
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        background: linear-gradient(to right, #bdc3c7, #2c3e50);
        opacity:.8;
        z-index: -1;
    }
`;

const Wrapper = styled.div` 
    display: grid;
    grid-template-columns: 16em 1fr;
    grid-template-rows: 4em 1fr 3em;
    grid-template-areas: "logo header" 
                        "nav main"
                        "nav footer";
    min-height: 100vh;
    overflow: hidden;
`;

const Main = styled.main` 
    grid-area: main;
    background-color: #efefef;
`;

function App() {
    return (
        <Router>
            <UserProvider>
                <Switch>
                    <Route exact path={["/", "/login", "/forgetPassword", "/changePassword/:token", "/firsttime/:token"]}>
                        <Landing>
                            <Route exact path="/" component={ Home } />
                            <Route exact path="/login" component={ Login } />
                            <Route exact path="/forgetPassword" component={ ForgetPassword } />
                            <Route exact path="/changePassword/:token" component={ ChangePassword } />
                            <Route exact path="/firsttime/:token" component={ FirstTime } />
                        </Landing>
                    </Route>
                    <Route path={["/admin", "/student", "/clerk", "/lecturer"]}>
                        <Wrapper>
                            <Header />
                            <Logo />
                            <Nav />
                            <Main>
                                <Switch>
                                    <Route path="/student">
                                        <StudentPanelRoutes />
                                    </Route>

                                    <Route path="/admin">
                                        <AdminPanelRoutes />
                                    </Route>

                                    <Route path="/clerk">
                                        <ClerkPanelRoutes />
                                    </Route>

                                    <Route path="/lecturer">
                                        <LecturerPanelRoutes />
                                    </Route>

                                    <AuthRoutes />

                                    <Route path="*">
                                        <PageNotFound />
                                    </Route>
                                </Switch>
                            </Main>
                            <Footer />
                        </Wrapper>
                    </Route>
                    <Route path="*">
                        <Landing>
                            <PageNotFound />
                        </Landing>
                    </Route>
                </Switch>
            </UserProvider>
        </Router>
    );
}

export default App;
