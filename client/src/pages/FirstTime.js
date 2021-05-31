import React, {useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {Alert, Button, Form, FormGroup, Input} from "reactstrap";
import {Link, useParams} from "react-router-dom";

import {userContext} from "../context/userContext";

import { LinkWrapper } from './ChangePassword';
import { LoginBox } from './Login';

const ChangePassword = props => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [password, setPassword] = useState("");
    let [password2, setPassword2] = useState("");

    const history = useHistory();
    const {token} = useParams();
    const {fetchApi} = useContext(userContext);

    const handleSendPassword = async () => {
        if(error) return;

        const [result, isOk] = await fetchApi("/auth/firsttime", {
            method: 'POST',
            body: JSON.stringify({password, password2, token})
        });

        setError(!isOk);
        setMessage("Błąd serwera");

        if(result.ok) {
            history.push("/login");
        } else {
            setError(true);
            setMessage(result.msg);
        }
    };

    useEffect(() => {

        if(password.length < 5) {
            setError(true);
            setMessage("Minimalna długość hasła to 5");
        } else if(password !== password2) {
            setError(true);
            setMessage("Hasła są różne");
        } else {
            setError(false);
        }

    }, [password, password2]);

    return(
        <LoginBox>
            <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                <h4>Ustaw Hasło</h4>
                <hr/>
                <p >Zmień przed pierwszym zalogowaniem</p>
                <hr/>
                <FormGroup>
                    <input  type="password" placeholder="Nowe hasło" value={password}
                            onChange={ e => setPassword(e.target.value) }/>
                </FormGroup>
                <FormGroup>
                    <input  type="password" placeholder="Wpisz ponowie hasło" value={password2}
                            onChange={ e => setPassword2(e.target.value) }/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <input type="submit" value="Zmień" />
                </FormGroup>
                <FormGroup>
                    {
                        error &&
                            <Alert fade={false} color={ error ? "danger" : "success"  }>{ message }</Alert> 
                    }
                </FormGroup>
            </Form>
        </LoginBox>
    )
};

export default ChangePassword;



