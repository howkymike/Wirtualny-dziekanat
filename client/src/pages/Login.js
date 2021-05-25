import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, FormGroup, Input, FormFeedback, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { useHistory, Link } from "react-router-dom";
import styled from 'styled-components';

import { userContext } from '../context/userContext';
import ErrorBox from '../components/Error';

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

const Login = () => {

    const { login, logged, roles } = useContext(userContext);
    const history = useHistory();

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [role, setRole] = useState("ROLE_STUDENT");
    let [error, setError] = useState([false, ""]);

    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const [isLoginInvalid, setIsLoginInvalid] = useState(false);

    const getHomeAddress = (role) => {
        switch (role) {
            case "ROLE_ADMIN": return "/admin";
            case "ROLE_STUDENT": return "/student";
            case "ROLE_CLERK": return "/clerk";
            case "ROLE_LECTURER": return "/lecturer";
            default: return "";
        }
    }

    const validate = () => {
        let valid = true;

        if (password.length === 0) {
            valid = false;
            setIsPasswordInvalid(true);
        }

        if (username.length === 0) {
            valid = false;
            setIsLoginInvalid(true);
        }

        return valid;
    }

    const handleLogin = async () => {

        if (!validate()) {
            return;
        }

        try {
            if (await login(username, password, role)) 
                history.push(getHomeAddress(roles[0]));    
        } catch (e) {
            setError([true, e.message]);
        }
    }

    useEffect(() => {
        setError([false, ""]);
    }, [username, password]);

    useEffect(() => {
        if (logged)
            history.push(getHomeAddress(roles[0]));
    }, [logged, history, roles]);

    return (
        <LoginBox>
            <Form onSubmit={e => { e.preventDefault(); handleLogin() }}>
                <h4>Zaloguj się</h4>
                <hr />
                <FormGroup>
                    <Input type="text" placeholder="Login" invalid={isLoginInvalid} value={username}
                        onChange={e => { setUsername(e.target.value); setIsLoginInvalid(e.target.value.length === 0); }} />
                    <FormFeedback>Podaj swój login.</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Input type="password" placeholder="Hasło" invalid={isPasswordInvalid} value={password}
                        onChange={e => { setPassword(e.target.value); setIsPasswordInvalid(e.target.value.length === 0); }} />
                    <FormFeedback>Wpisz hasło.</FormFeedback>
                </FormGroup>
                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                    <InputGroupText>Rola</InputGroupText>
                    </InputGroupAddon>
                    <Input type="select" value={ role } onChange={ e => setRole(e.target.value) }>
                        <option value="ROLE_STUDENT">Student</option>
                        <option value="ROLE_LECTURER">Wykładowca</option>
                        <option value="ROLE_CLERK">Pracownik dziekanatu</option>
                        <option value="ROLE_ADMIN">Admin</option>
                    </Input>
                </InputGroup>

                <ForgotPassword><Link to={"forgetPassword"}>Zapomiałem hasła</Link></ForgotPassword>
                <FormGroup>
                    <Button block color="primary">Zaloguj</Button>
                </FormGroup>
                <FormGroup>
                    <ErrorBox error={error} />
                </FormGroup>
            </Form>
        </LoginBox>
    );
}
export default Login;