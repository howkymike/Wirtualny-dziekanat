import React, {useContext, useEffect, useState} from "react";

import styled from "styled-components";
import {Alert, Form, FormGroup } from "reactstrap";
import {Link, useParams} from "react-router-dom";

import {userContext} from "../context/userContext";
import { LoginBox } from './Login';

export const LinkWrapper = styled.div`
    width: 100%;  
    padding: 10px;
    text-align: left;
`;

const ChangePassword = props => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [repeatPassword, setRepeatPassword] = useState("");

    const {token} = useParams();
    const {fetchApi} = useContext(userContext);

    const handleSendPassword = async () => {
        if(error) return;

        if(!newPassword || !repeatPassword){
            setError(true);
            setMessage(newPassword ? "Proszę powtorzyć hasło." : "Proszę wprowadzić hasło.");
            return;
        }

        const [result, isOk] = await fetchApi("/auth/changePassword", {
            method: 'PUT',
            body: JSON.stringify({newPassword, token})
        });

        setError(!isOk);
        setMessage(result.message);
    };

    useEffect(() => {
        if(newPassword && newPassword.length < 5){
            setError(true);
            setMessage("Hasło powinno zawierać przynajmniej 5 znaków.");
        }else if(newPassword && repeatPassword && newPassword !== repeatPassword ) {
            setError(true);
            setMessage("Hasła muszą być takie same.");
        }else {
            setError(false);
            setMessage("");
        }
    }, [newPassword, repeatPassword]);

    return(
        <LoginBox>
            <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                <h4>Zmien hasło</h4>
                <hr/>
                <p >Wprowadź nowe hasło.</p>
                <hr/>
                <FormGroup>
                    <input  type="password" placeholder="Nowe hasło" name="password" value={newPassword}
                            onChange={ e => setNewPassword(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <input  type="password" placeholder="Wpisz ponownie hasło" name="repeatPassword" value={repeatPassword}
                            onChange={ e => setRepeatPassword(e.target.value)}/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <input type="submit" value="Zmień" />
                </FormGroup>
                <FormGroup>
                    {
                        message ?
                            <Alert color={ error ? "danger" : "success"  }>{message}</Alert> : ""
                    }
                </FormGroup>
            </Form>
        </LoginBox>
    )
};

export default ChangePassword;



