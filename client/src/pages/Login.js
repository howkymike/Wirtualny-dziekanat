import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Alert } from 'reactstrap';
import { useHistory, Link } from "react-router-dom";
import styled from 'styled-components';

import { userContext } from '../context/userContext';

const LoginBox = styled.div` 
    width: 30em;
    padding: 1em;
    border-radius: 10px;
    background-color: #F5F3F5;
    color: #303030;
    margin: auto;
    text-align: center;
`;

const ForgotPassword = styled.div`
    width: 100%;  
    padding: 10px;
    text-align: left;
`;

const Login = props => {

    const { login, logged, roles } = useContext(userContext);
    const history = useHistory();

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState("");

    const getHomeAddress = (role) => {
        switch (role) {
            case "ROLE_ADMIN": return "/admin";
            case "ROLE_STUDENT": return "/student";
            case "ROLE_STUFF": return "/stuff";
        }
    }

    const handleLogin = async () => {
        try {
            if (await login(username, password))
                history.push(getHomeAddress(roles[0]));
        } catch (e) {
            console.log("Error", e);
            setError(e.message);
        }
    }

    useEffect(() => {
        if (logged)
            history.push(getHomeAddress(roles[0]));
        console.log(roles)
    }, [logged, history]);

    return (
        <LoginBox>
            <Form onSubmit={e => { e.preventDefault(); handleLogin() }}>
                <h4>Zaloguj się</h4>
                <hr />
                <FormGroup>
                    <Input type="text" placeholder="Login" value={username} onChange={e => setUsername(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
                </FormGroup>

                <ForgotPassword><Link to={"forgetPassword"}>Zapomiałem hasła</Link></ForgotPassword>
                <FormGroup>
                    <Button block color="primary">Zaloguj</Button>
                </FormGroup>
                <FormGroup>
                    {error !== "" &&
                        <Alert color="danger" fade={false}>
                            {error}
                        </Alert>
                    }
                </FormGroup>
            </Form>
        </LoginBox>
    );
}
export default Login;