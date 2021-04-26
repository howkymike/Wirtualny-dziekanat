import { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';


const UserTab = props => {

    const { onUserChange, user } = props;
    const [newUserData, setNewUserData] = useState({});

    useEffect(() => {
        onUserChange({ ...user, ...newUserData });
    }, [newUserData]);

    return (
        <Form>
            <Row>
                <Col>
                    <FormGroup>
                        <Label>Name:</Label>
                        <Input
                            type="text"
                            placeholder="Name"
                            value={props.user.name}
                            onChange={(e) => setNewUserData({ name: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Surname:</Label>
                        <Input
                            type="text"
                            placeholder="Surname"
                            value={props.user.surname}
                            onChange={(e) => setNewUserData({ surname: e.target.value })}
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
                            value={props.user.email}
                            onChange={(e) => setNewUserData({ email: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Phone number:</Label>
                        <Input
                            type="text"
                            placeholder="Phone number"
                            value={props.user.telephone}
                            onChange={(e) => setNewUserData({ telephone: e.target.value })}
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
                            value={props.user.country}
                            onChange={(e) => setNewUserData({ country: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>City:</Label>
                        <Input
                            type="text"
                            placeholder="City"
                            value={props.user.city}
                            onChange={(e) => setNewUserData({ city: e.target.value })}
                        />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Postal Code:</Label>
                        <Input
                            type="text"
                            placeholder="City"
                            value={props.user.postalCode}
                            onChange={(e) => setNewUserData({ postalCode: e.target.value })}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                <Label>Address</Label>
                <Input
                    type="text"
                    placeholder="Address"
                    value={props.user.address}
                    onChange={(e) => setNewUserData({ address: e.target.value })}
                />
            </FormGroup>
        </Form>
    );
}

export default UserTab;






