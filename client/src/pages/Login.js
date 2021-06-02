import React, { useContext, useState, useEffect } from 'react';
import { Form } from 'reactstrap';
import { useHistory, Link } from "react-router-dom";
import styled from 'styled-components';

import { userContext } from '../context/userContext';
import ErrorBox from '../components/Error';

export const LoginBox = styled.div` 
    background-color: #fff;
    padding: 2em;
    max-width: min(100%, 30em);
    margin: auto;
    border-bottom: 0.5em solid #2c3e50;
    color: #000;

    h6 {
        text-align: center;
    }

    input, select {
        width: 100%;
        margin-bottom: 1em;
        height: 2.5em;
        border-radius: 0;
        border: 0;
        border-bottom: 0.25em solid #bdc3c7;
        outline: 0;
        background-color: #fff;
        padding: 0 1em;
    }

    input[type="submit"] {
        background-color: #bdc3c7;
        border: 0;
        margin: 1em 0;
    }

    input:focus, select:focus {
        border: 0;
        border-bottom: 0.25em solid #2384e6;
    }
`;

const Wrong = styled.div` 
    color: red;
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
                <h6>ZALOGUJ</h6>
                <hr />
                <label htmlFor="login">LOGIN:</label>
                <input 
                    type="text" id="login" placeholder="Login"  value={username} 
                    onChange={e => { setUsername(e.target.value); setIsLoginInvalid(e.target.value.length === 0); }} 
                />
                { isLoginInvalid &&
                    <Wrong>Podaj swój login.</Wrong>
                }

                <label htmlFor="password">HASŁO:</label>
                <input 
                    type="password" id="password" placeholder="Hasło" value={password}
                    onChange={e => { setPassword(e.target.value); setIsPasswordInvalid(e.target.value.length === 0); }}
                />
                { isPasswordInvalid &&
                    <Wrong>Wpisz hasło.</Wrong>
                }
                <label htmlFor="role">ROLA:</label>
                <select id="role" value={ role } onChange={ e => setRole(e.target.value) }>
                    <option value="ROLE_STUDENT">Student</option>
                    <option value="ROLE_LECTURER">Wykładowca</option>
                    <option value="ROLE_CLERK">Pracownik dziekanatu</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
                <Link to="/forgetPassword">Zapomiałem hasła</Link>
                <br />

                <input type="submit" value="Zaloguj" />
            </Form>

            <ErrorBox error={error} />
        </LoginBox>
    );
}
export default Login;

/*<FormGroup>
                    <Input type="text" placeholder="Login"  />
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
            </Form>*/