import { useState, useEffect, useContext } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { userContext } from '../../context/userContext'

const LecturerTab = props => {

    const { fetchApi } = useContext(userContext);
    const { onUserChange, user } = props;

    const [lecturer, setLecturer] = useState(user.lecturer);
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        onUserChange( lecturer );
    }, [lecturer, onUserChange]);

    useEffect(() => {
        fetchApi("/faculties").then((res) => {
            if (res[1])
                setFaculties(res[0]);
        });
    }, [fetchApi])

    const setFaculty = (facultyId) => {
        if (facultyId) {
            setLecturer({ ...lecturer, facultyId });
        }
    }

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Title:</Label>
                        <Input
                            type="text"
                            placeholder="Title"
                            value={lecturer.title}
                            onChange={(e) => setLecturer({ ...lecturer, title: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Faculty:</Label>
                        <Input
                            type="select"
                            value={lecturer.facultyId}
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

export default LecturerTab;