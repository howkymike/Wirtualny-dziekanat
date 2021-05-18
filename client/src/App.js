import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserProvider } from './context/userContext';

import Nav from './components/Nav';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import AdminPanelRoutes from './routes/AdminPanelRoutes';
import AuthRoutes from './routes/AuthRoutes';
import StudentPanelRoutes from './routes/StudentPanelRoutes';
import ClerkPanelRoutes from './routes/ClerkPanelRoutes';
import LecturerPanelRoutes from './routes/LecturerPanelRoutes';

const Wrapper = styled.div`
  height: 100vh;
  color: #ffffff;
  background: rgb(27, 38, 79);
  background: linear-gradient(52deg, rgba(27, 38, 79, 1) 1%, rgba(39, 70, 144, 1) 100%);
  display: flex;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const Main = styled.main`
  padding: 2em;
  flex: 1;
`;

function App() {
    return (
        <Router>
            <UserProvider>
                <Wrapper className="App">
                    <Route path={["/admin", "/student", "/clerk", "/lecturer"]}>
                        <Nav />
                    </Route>
                    <Right>
                        <Header></Header>
                        <Main>
                            <Switch>
                                <Route exact path="/">
                                    <Home />
                                </Route>

                                {/* Panels */}
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

                                { /* Page not found */}
                                <Route path="*">
                                    <PageNotFound />
                                </Route>
                            </Switch>
                        </Main>
                        <Footer />
                    </Right>
                </Wrapper>
            </UserProvider>
        </Router>
    );
}

export default App;
