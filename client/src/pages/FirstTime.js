import React, {useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import {Alert, Button, Form, FormGroup, Input} from "reactstrap";
import {Link, useParams} from "react-router-dom";

import {userContext} from "../context/userContext";

import { Box, LinkWrapper } from './ChangePassword';

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
        <Box>
            <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                <h4>Ustaw Hasło</h4>
                <hr/>
                <p >Zmień przed pierwszym zalogowaniem</p>
                <hr/>
                <FormGroup>
                    <Input  type="password" placeholder="Nowe haslo" value={password}
                            onChange={ e => setPassword(e.target.value) }/>
                </FormGroup>
                <FormGroup>
                    <Input  type="password" placeholder="Wpisz ponowie haslo" value={password2}
                            onChange={ e => setPassword2(e.target.value) }/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <Button block color="primary">Zmien</Button>
                </FormGroup>
                <FormGroup>
                    {
                        error &&
                            <Alert fade={false} color={ error ? "danger" : "success"  }>{ message }</Alert> 
                    }
                </FormGroup>
            </Form>
        </Box>
    )
};

export default ChangePassword;



