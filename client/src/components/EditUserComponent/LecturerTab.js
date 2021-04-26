import { useState, useEffect, useContext } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { userContext } from '../../context/userContext'

const LecturerTab = props => {

    const { fetchApi } = useContext(userContext);
    const { onUserChange, user } = props;

    const [newLecturer, setNewLecturer] = useState(user.lecturer);
    const [faculties, setFaculties] = useState([]);


    useEffect(() => {
        onUserChange({ ...user, lecturer: { ...newLecturer } });
    }, [newLecturer]);

    useEffect(() => {
        fetchApi("/faculties").then((res) => {
            if (res[1])
                setFaculties(res[0]);
        });
    }, [fetchApi])

    const setFaculty = (facultyId) => {
        if (facultyId) {
            setNewLecturer({ ...newLecturer, facultyId });
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
                            value={newLecturer.title}
                            onChange={(e) => setNewLecturer({ ...newLecturer, title: e.target.value })}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Faculty:</Label>
                        <Input
                            type="select"
                            value={newLecturer.facultyId}
                            onChange={(e) => setFaculty(e.target.value)}
                        >
                            <option value="">"Select value</option>
                            {faculties.map((faculty, key) => (
                                <option value={faculty.faculty_id} key={key}>{faculty.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

export default LecturerTab;