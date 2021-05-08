import { useState, useEffect } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

const StudentTab = props => {
    const { onUserChange, user } = props;
    const [student, setStudent] = useState(user.student);

    useEffect(() => {
        onUserChange(student);
    }, [student, onUserChange]);

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Indeks:</Label>
                        <Input
                            type="text"
                            placeholder="Indeks"
                            value={student.index}
                            onChange={(e) => setStudent({...student, index: e.target.value})}
                        />
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

export default StudentTab;