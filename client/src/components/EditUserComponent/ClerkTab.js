import { useState, useEffect, useContext } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { userContext } from '../../context/userContext'

const ClerkTab = props => {

    const { fetchApi } = useContext(userContext);
    const { onUserChange, user } = props;

    const [clerk, setClerk] = useState(user.clerk);
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        onUserChange( clerk );
    }, [clerk, onUserChange]);

    useEffect(() => {
        fetchApi("/faculties").then((res) => {
            if (res[1])
                setFaculties(res[0]);
        });
    }, [fetchApi])

    const setFaculty = (facultyId) => {
        if (facultyId) {
            setClerk({ ...clerk, facultyId });
        }
    }

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Faculty:</Label>
                        <Input
                            type="select"
                            value={clerk.facultyId}
                            onChange={(e) => setFaculty(e.target.value)}
                        >
                            {faculties.map((faculty, key) => (
                                <option value={faculty.id} key={key}>{faculty.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

export default ClerkTab;