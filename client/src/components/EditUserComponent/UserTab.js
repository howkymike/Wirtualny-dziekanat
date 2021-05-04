import { useState, useEffect } from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Col, Form, FormGroup, Input, Label, Row, Badge, Button } from 'reactstrap';

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

const UserTab = props => {

    const { onUserChange, user } = props;
    const [newUserData, setNewUserData] = useState(user);

    useEffect(() => {
        setNewUserData(user);
    }, [user])

    useEffect(() => {
        onUserChange(newUserData);
    }, [newUserData, onUserChange]);

    const deleteRole = (key) => {
        const role = newUserData.roles[key];
        let newUser = { ...newUserData };

        switch (role) {
            case "ROLE_ADMIN": break;
            case "ROLE_STUDENT":
                newUser.student = null;
                break;
            case "ROLE_LECTURER":
                newUser.lecturer = null;
                break;
            case "ROLE_CLERK":
                newUser.clerk = null;
                break;
            default: return;
        }

        newUser.roles.splice(key, 1);
        setNewUserData(newUser);
    }


    return (
        <Form>
            <Row>
                <Col>
                    <FormGroup>
                        <Label>Name:</Label>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Surname:</Label>
                        <Input
                            type="text"
                            placeholder="Surname"
                            value={newUserData.surname}
                            onChange={(e) => setNewUserData({ ...newUserData, surname: e.target.value })}
                        />
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
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Phone number:</Label>
                        <Input
                            type="text"
                            placeholder="Phone number"
                            value={newUserData.telephone}
                            onChange={(e) => setNewUserData({ ...newUserData, telephone: e.target.value })}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Country:</Label>
                        <Input
                            type="text"
                            placeholder="Country"
                            value={newUserData.country}
                            onChange={(e) => setNewUserData({ ...newUserData, country: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>City:</Label>
                        <Input
                            type="text"
                            placeholder="City"
                            value={newUserData.city}
                            onChange={(e) => setNewUserData({ ...newUserData, city: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Postal Code:</Label>
                        <Input
                            type="text"
                            placeholder="City"
                            value={newUserData.postalCode}
                            onChange={(e) => setNewUserData({ ...newUserData, postalCode: e.target.value })}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                <Label>Address:</Label>
                <Input
                    type="text"
                    placeholder="Address"
                    value={newUserData.address}
                    onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <Label>Roles:</Label>
                <div>
                    {user.roles.map((role, key) => (
                        <Role color="primary" key={key}>
                            {role}
                            { (user.roles.length > 1) &&
                                    <RoleButton 
                                        size="sm" icon={faTimes} 
                                        onClick={() => { deleteRole(key)}}/>
                            }
                        </Role>
                    ))}
                </div>
            </FormGroup>
        </Form>
    );
}

export default UserTab;






