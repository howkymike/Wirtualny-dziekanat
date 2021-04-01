import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Alert } from 'reactstrap';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';

import { userContext } from '../context/userContext';

const LoginBox = styled.div` 
    width: 30em;
    padding: 1em;
    background: #1D4350; 
    background: -webkit-linear-gradient(to bottom, #A43931, #1D4350);  
    background: linear-gradient(to bottom, #A43931, #1D4350); 
    margin: auto;
    text-align: center;
`;

const Login = props => {

    const { login, logged } = useContext(userContext);
    const history = useHistory();

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            if(await login(username, password))
                history.push('/student');
        } catch(e) {
            console.log("Error", e);
            setError(e.message);
        }
    }

    useEffect(() => {
        if(logged)
            history.push('/student');
    }, [logged, history]);

    return(
        <LoginBox>
            <Form onSubmit={ e => { e.preventDefault(); handleLogin() } }>
                <h4>Zaloguj się</h4>
                <hr />
                <FormGroup>
                    <Input type="text" placeholder="Login" value={username} onChange={ e => setUsername(e.target.value) } />
                </FormGroup>
                <FormGroup>
                    <Input type="password" placeholder="Hasło" value={password} onChange={ e => setPassword(e.target.value) } />
                </FormGroup>
                <FormGroup>
                    <Button block>Zaloguj</Button>
                </FormGroup>
                <FormGroup>
                    { error !== "" && 
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