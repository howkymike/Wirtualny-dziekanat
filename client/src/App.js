import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserProvider } from './context/userContext';

import Nav from './components/Nav';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';

const Wrapper = styled.div` 
    min-height: 100vh;
    color: #ffffff;
    background-color: #292929;
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
                    <Route path={/^(?!\/unlock)(?!\/login)(?!\/register)(?!\/$)[/\w]*/} exact component={Nav} />
                    <Right>
                        <Header></Header>
                        <Main>
                            <Switch>
                                <Route path="/login">
                                    <Login />
                                </Route>
                                <Route path="/student">
                                    adwdawd
                                </Route>
                                <Route exact path="/">
                                    <Home />
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
