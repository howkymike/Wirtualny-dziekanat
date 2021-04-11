import styled from 'styled-components';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import {UserProvider} from './context/userContext';

import Nav from './components/Nav';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";

const Wrapper = styled.div`
  min-height: 100vh;
  color: #ffffff;
  background: rgb(27, 38, 79);
  background: linear-gradient(52deg, rgba(27, 38, 79, 1) 1%, rgba(39, 70, 144, 1) 100%);
  display: flex;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
                    <Route path={/^(?!\/login)(?!\/register)(?!\/forgetPassword)(?!\/changePassword)(?!\/$)[/\w]*/} exact component={Nav}/>
                    <Right>
                        <Header></Header>
                        <Main>
                            <Switch>
                                <Route path="/login">
                                    <Login/>
                                </Route>
                                <Route path="/student">
                                    adwdawd
                                </Route>
                                <Route exact path="/">
                                    <Home/>
                                </Route>
                                <Route path="/forgetPassword">
                                    <ForgetPassword/>
                                </Route>
                                <Route path="/changePassword/:token">
                                    <ChangePassword/>
                                </Route>
                            </Switch>
                        </Main>
                        <Footer/>
                    </Right>
                </Wrapper>
            </UserProvider>
        </Router>
    );
}

export default App;
