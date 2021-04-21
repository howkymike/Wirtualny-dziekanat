import React, {useContext, useEffect, useState} from "react";

import {Alert, Button, Form, FormGroup, Input, InputGroupAddon, InputGroup, InputGroupText} from "reactstrap";

import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import {userContext} from "../context/userContext";
import {Box} from "./ChangePassword";

const ChangeActualPassword = props => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [repeatPassword, setRepeatPassword] = useState("");
    let [actualPassword, setActualPassword] = useState("");
    let [showActualPassword, setShowActualPassword] = useState("password");
    let [showNewPassword, setShowNewPassword] = useState("password");
    let [showNewSecondPassword, setShowNewSecondPassword] = useState("password");

    const {fetchApi} = useContext(userContext);

    const handleSendPassword = async () => {
        if(error) return;

        if(!newPassword || !repeatPassword){
            setError(true);
            setMessage(newPassword ? "Proszę powtorzyć hasło." : "Proszę wprowadzić hasło.");
            return;
        }

        const [result, isOk] = await fetchApi("/auth/changeactualpassword", {
            method: 'POST',
            body: JSON.stringify({actualPassword:actualPassword, newPassword:newPassword, secondNewPassword:repeatPassword})
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
        <Box>
            <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                <h4>Zmien aktualne hasło</h4>
                <hr/>
                <p >Wprowadź aktualne hasło.</p>
                <hr/>
                <FormGroup>
                    <InputGroup>
                        <Input type={showActualPassword} placeholder="Aktualne haslo" value={actualPassword}
                               onChange={e => setActualPassword(e.target.value)}/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText onMouseDown={() => setShowActualPassword("text")}
                                            onMouseUp={() => setShowActualPassword("password")}><Fa
                                icon={faEyeSlash} size="1x"/></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                <hr/>
                <p >Wprowadź nowe hasło.</p>
                <hr/>
                <FormGroup>
                    <InputGroup>
                        <Input type={showNewPassword} placeholder="Nowe hasło" name="password" value={newPassword}
                               onChange={e => setNewPassword(e.target.value)}/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText onMouseDown={() => setShowNewPassword("text")}
                                            onMouseUp={() => setShowNewPassword("password")}><Fa
                                icon={faEyeSlash} size="1x"/></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <Input type={showNewSecondPassword} placeholder="Wpisz ponownie hasło" name="repeatPassword"
                               value={repeatPassword}
                               onChange={e => setRepeatPassword(e.target.value)}/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText onMouseDown={() => setShowNewSecondPassword("text")}
                                            onMouseUp={() => setShowNewSecondPassword("password")}><Fa
                                icon={faEyeSlash} size="1x"/></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <Button block color="primary">Zmień</Button>
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

export default ChangeActualPassword;



