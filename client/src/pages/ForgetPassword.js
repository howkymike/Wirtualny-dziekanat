import React, {useContext, useState} from "react";

import styled from "styled-components";
import {Alert, Button, Form, FormGroup, Input} from "reactstrap";
import { LoginBox } from './Login';
import {userContext} from "../context/userContext";

import {Link} from "react-router-dom";



const LinkWrapper = styled.div`
    width: 100%;  
    padding: 10px;
    text-align: left;
`;

const ForgetPassword = () => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [username, setUsername] = useState("");
    const {fetchApi} = useContext(userContext);

    const handleSendUsername = async () => {
        if(!username.length){
            setError(true);
            setMessage("Proszę podać swój login");
            return
        }

        const [result, isOk] = await fetchApi("/auth/forgetPassword",{
            method: 'POST',
            body: JSON.stringify({ username }),
        });

        setError(!isOk);
        setMessage(result.message);
    };

    return(
        <LoginBox>
            <Form onSubmit={e => {e.preventDefault(); handleSendUsername();}}>
                <h4>Zapomiałeś hasła?</h4>
                <hr/>
                <p >Wprowadź swój login, a wyślemy ci link do zmiany hasła.</p>
                <hr/>
                <FormGroup>
                    <input  type="text" placeholder="Login" name="username" value={username} onChange={ e => setUsername(e.target.value)}/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <input type="submit" value="Wyślij" />
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

export default ForgetPassword;



