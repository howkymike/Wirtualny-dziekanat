import React, {useContext, useState} from "react";

import styled from "styled-components";
import {Alert, Button, Form, FormGroup, Input} from "reactstrap";

import {userContext} from "../context/userContext";

import {Link} from "react-router-dom";

const Box = styled.div` 
    width: 30em;
    padding: 1em;
    border-radius: 10px;
    background-color: #F5F3F5;
    color: #303030;
    margin: auto;
    text-align: center;
`;

const LinkWrapper = styled.div`
    width: 100%;  
    padding: 10px;
    text-align: left;
`;

const ForgetPassword = props => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [username, setUsername] = useState("");
    const {fetchApi} = useContext(userContext);

    const handleSendUsername = async () => {
        if(!username.length){
            setError(true);
            setMessage("Prosze podac swój login");
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
        <Box>
            <Form onSubmit={e => {e.preventDefault(); handleSendUsername();}}>
                <h4>Zapomiałeś hasła?</h4>
                <hr/>
                <p >Wprowadź swój login, a wyślemy ci link do zmiany hasła.</p>
                <hr/>
                <FormGroup>
                    <Input  type="text" placeholder="Login" name="username" value={username} onChange={ e => setUsername(e.target.value)}/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <Button block color="primary">Wyślij</Button>
                </FormGroup>
                <FormGroup>
                    {
                         message ?
                            <Alert color={ error ? "danger" : "success"  }>{message}</Alert> : ""
                    }
                </FormGroup>
            </Form>
        </Box>
    )
};

export default ForgetPassword;



