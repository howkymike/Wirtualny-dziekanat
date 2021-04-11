import React, {useContext, useState} from "react";

import styled from "styled-components";
import {Alert, Button, Form, FormGroup, Input} from "reactstrap";
import {Link, useParams} from "react-router-dom";

import {userContext} from "../context/userContext";

export const Box = styled.div` 
    width: 30em;
    padding: 1em;
    border-radius: 10px;
    background-color: #F5F3F5;
    color: #303030;
    margin: auto;
    text-align: center;
`;

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
        if(!newPassword.length){
            setError(true);
            setMessage("Zaleca sie wprowadzic haslo xd");
            return;
        }

        const [result, isOk] = await fetchApi("/auth/changePassword", {
            method: 'PUT',
            body: JSON.stringify({newPassword, token})
        });

        setError(!isOk);
        setMessage(result.message);
    };

    const verifyPassword = (value, passwd) => {
        if(value && passwd && passwd !== value ) {
            setError(true);
            setMessage("Hasla musza byc takie same.");
        }else{
            setError(false);
            setMessage("");
        }
    };

    return(
        <Box>
            <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                <h4>Zmien haslo</h4>
                <hr/>
                <p >Wprowadź nowe haslo.</p>
                <hr/>
                <FormGroup>
                    <Input  type="password" placeholder="Nowe haslo" name="password" value={newPassword}
                            onChange={ e => {
                                setNewPassword(e.target.value);
                                verifyPassword(e.target.value, repeatPassword);
                            }}/>
                </FormGroup>
                <FormGroup>
                    <Input  type="password" placeholder="Wpisz ponowie haslo" name="repeatPassword" value={repeatPassword}
                            onChange={ e => {
                                setRepeatPassword(e.target.value);
                                verifyPassword(e.target.value, newPassword);
                            }}/>
                </FormGroup>
                <LinkWrapper><Link to="/login">Powrót do logowania</Link></LinkWrapper>
                <FormGroup>
                    <Button block color="primary">Zmien</Button>
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

export default ChangePassword;



