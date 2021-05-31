import { useState, useEffect } from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Col, Form, FormGroup, Input, Label, Row, Badge, FormFeedback } from 'reactstrap';

const Role = styled(Badge)`
    margin: 2px;
`

const RoleButton = styled(FontAwesomeIcon)`
    margin: 0 2px 0 10px;
    color: white;

    &:hover {
        cursor: pointer;
    }
`

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

const UserTab = props => {

    const { state, dispatch } = props;

    const [invalidName, setInvalidName] = useState(false);
    const [invalidSurname, setInvalidSurname] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidNumber, setInvalidNumber] = useState(false);
    const [invalidPostalCode, setInvalidPostalCode] = useState(false);
    const [invalidCountry, setInvalidCountry] = useState(false);
    const [invalidCity, setInvalidCity] = useState(false);
    const [invalidAddress, setInvalidAddress] = useState(false);

    useEffect(() => {
        // Validate user data :)
        let error = false;
        const user = state.user;

        const validate = (callback) => {
            const res = callback();
            if (!res) {
                error = true;
            }
            // return false if data is invalid
            return !res;
        }

        setInvalidName(validate(() => user.name.length > 0));
        setInvalidSurname(validate(() => user.surname.length > 0));

        setInvalidEmail(validate(() => user.email.match(emailRegex)));
        setInvalidNumber(validate(() => user.telephone.match(/^(\+\d{2}){0,1}\d{9}$/)));

        setInvalidCountry(validate(() => user.country.length > 0));
        setInvalidCity(validate(() => user.city.length > 0));
        setInvalidPostalCode(validate(() => user.postalCode.match(/^\d{2}-\d{3}$/)));
        setInvalidAddress(validate(() => user.address.length > 0));

        dispatch({ type: "error", data: { userError: error } });

    }, [state.user, dispatch]);

    const deleteRole = (key) => {
        let roles = state.user.roles;
        const role = roles[key];

        switch (role) {
            case "ROLE_ADMIN": break;
            case "ROLE_STUDENT":
                dispatch({ type: "student", data: null });
                break;
            case "ROLE_LECTURER":
                dispatch({ type: "lecturer", data: null });
                break;
            case "ROLE_CLERK":
                dispatch({ type: "clerk", data: null });
                break;
            default: return;
        }

        const newRoles = roles.filter((value) => value !== role);
        dispatch({ type: "roles", data: newRoles });
    }

    const getRoleName = (role) => {
        if (role.startsWith("ROLE_")) {
            return role[5].toUpperCase() + role.substring(6).toLowerCase();
        } else {
            return "";
        }
    }

    return (
        <Form>
            <Row>
                <Col>
                    <FormGroup>
                        <Label>Imię:</Label>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={state.user.name}
                            invalid={invalidName}
                            onChange={(e) => dispatch({ type: "name", data: e.target.value })}
                        />
                        <FormFeedback>To pole nie moze byc puste.</FormFeedback>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Nazwisko:</Label>
                        <Input
                            type="text"
                            placeholder="Surname"
                            value={state.user.surname}
                            invalid={invalidSurname}
                            onChange={(e) => dispatch({ type: "surname", data: e.target.value })}
                        />
                        <FormFeedback>To pole nie moze byc puste.</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Email:</Label>
                        <Input
                            type="text"
                            placeholder="Email"
                            value={state.user.email}
                            invalid={invalidEmail}
                            onChange={(e) => dispatch({ type: "email", data: e.target.value })}
                        />
                        <FormFeedback>Email jest niepoprawny</FormFeedback>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Telefon:</Label>
                        <Input
                            type="text"
                            placeholder="Phone number"
                            value={state.user.telephone}
                            invalid={invalidNumber}
                            onChange={(e) => dispatch({ type: "telephone", data: e.target.value })}
                        />
                        <FormFeedback>Numer jest niepoprawny.</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Kraj:</Label>
                        <Input
                            type="text"
                            placeholder="Country"
                            value={state.user.country}
                            invalid={invalidCountry}
                            onChange={(e) => dispatch({ type: "country", data: e.target.value })}
                        />
                        <FormFeedback>To pole nie moze byc puste.</FormFeedback>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Miasto:</Label>
                        <Input
                            type="text"
                            placeholder="City"
                            value={state.user.city}
                            invalid={invalidCity}
                            onChange={(e) => dispatch({ type: "city", data: e.target.value })}
                        />
                        <FormFeedback>To pole nie moze byc puste.</FormFeedback>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Kod pocztowy:</Label>
                        <Input
                            type="text"
                            placeholder="Postal code"
                            value={state.user.postalCode}
                            invalid={invalidPostalCode}
                            onChange={(e) => dispatch({ type: "postalCode", data: e.target.value })}
                        />
                        <FormFeedback>Kod jest niepoprawny.</FormFeedback>
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                <Label>Adres:</Label>
                <Input
                    type="text"
                    placeholder="Address"
                    value={state.user.address}
                    invalid={invalidAddress}
                    onChange={(e) => dispatch({ type: "address", data: e.target.value })}
                />
                <FormFeedback>To pole nie może byc puste.</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label>Role:</Label>
                <div>
                    {state.user.roles.map((role, key) => (
                        <Role color="primary" key={key}>
                            {getRoleName(role).toUpperCase()}
                            { (state.user.roles.length > 1) &&
                                <RoleButton
                                    size="sm" icon={faTimes}
                                    onClick={() => { deleteRole(key) }} />
                            }
                        </Role>
                    ))}
                </div>
            </FormGroup>
        </Form>
    );
}

export default UserTab;
