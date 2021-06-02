import React, {useContext, useEffect, useState} from "react";

import {Alert, Form, FormGroup, InputGroupText} from "reactstrap";

import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import {faEyeSlash} from '@fortawesome/free-solid-svg-icons';

import {userContext} from "../context/userContext";
import Wrapper, { Header, Padding, Input, InputGroup, Submit } from '../components/Wrapper';

const ChangeActualPassword = props => {

    let [error, setError] = useState(false);
    let [message, setMessage] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [repeatPassword, setRepeatPassword] = useState("");
    let [actualPassword, setActualPassword] = useState("");
    let [showActualPassword, setShowActualPassword] = useState("password");
    let [showNewPassword, setShowNewPassword] = useState("password");
    let [showNewSecondPassword, setShowNewSecondPassword] = useState("password");

    const {fetchApi, setHeader} = useContext(userContext);

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

    useEffect(() => {
        setHeader("Zmień hasło");
    }, [setHeader]);

    return(
        <Wrapper>
            <Header>Zmień aktualne hasło</Header>
            <Padding>
                <Form onSubmit={e => {e.preventDefault(); handleSendPassword();}}>
                    <p >Wprowadź aktualne hasło.</p>
                    <hr/>
                    <FormGroup>
                        <InputGroup>
                            <Input type={showActualPassword} placeholder="Aktualne haslo" value={actualPassword}
                                onChange={e => setActualPassword(e.target.value)}/>
                            <div className="append">
                                <InputGroupText onMouseDown={() => setShowActualPassword("text")}
                                                onMouseUp={() => setShowActualPassword("password")}><Fa
                                    icon={faEyeSlash} size="1x"/></InputGroupText>
                            </div>
                        </InputGroup>
                    </FormGroup>
                    <p >Wprowadź nowe hasło.</p>
                    <hr/>
                    <FormGroup>
                        <InputGroup>
                            <Input type={showNewPassword} placeholder="Nowe hasło" name="password" value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}/>
                            <div className="append">
                                <InputGroupText onMouseDown={() => setShowNewPassword("text")}
                                                onMouseUp={() => setShowNewPassword("password")}><Fa
                                    icon={faEyeSlash} size="1x"/></InputGroupText>
                            </div>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup>
                            <Input type={showNewSecondPassword} placeholder="Wpisz ponownie hasło" name="repeatPassword"
                                value={repeatPassword}
                                onChange={e => setRepeatPassword(e.target.value)}/>
                            <div className="append">
                                <InputGroupText onMouseDown={() => setShowNewSecondPassword("text")}
                                                onMouseUp={() => setShowNewSecondPassword("password")}><Fa
                                    icon={faEyeSlash} size="1x"/></InputGroupText>
                            </div>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Submit type="submit" value="Zmień"></Submit>
                    </FormGroup>
                    <FormGroup>
                        {
                            message ?
                                <Alert color={ error ? "danger" : "success"  }>{message}</Alert> : ""
                        }
                    </FormGroup>
                </Form>
            </Padding>
        </Wrapper>
    )
};

export default ChangeActualPassword;



