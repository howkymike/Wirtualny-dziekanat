import { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

const StudentTab = props => {
    const { onUserChange, user } = props;
    const [newUserData, setNewUserData] = useState(props.user);

    useEffect(() => {
        onUserChange({ ...user, ...newUserData });
    }, [newUserData]);

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Indeks:</Label>
                        <Input
                            type="text"
                            placeholder="Indeks"
                            value={newUserData.student.index}
                            onChange={(e) => setNewUserData({ student: { index: e.target.value } })}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

export default StudentTab;