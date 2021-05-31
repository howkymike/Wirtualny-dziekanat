import { useState, useEffect, useContext, useCallback } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { userContext } from '../../context/userContext'

const LecturerTab = props => {

    const { fetchApi } = useContext(userContext);
    const { state, dispatch } = props;

    const [faculties, setFaculties] = useState([]);

    const setFaculty = useCallback((facultyId) => {
        dispatch({ type: "lecturer", data: { ...state.user.lecturer, facultyId } });
    },[dispatch, state.user.lecturer]);

    const setTitle = (title) => {
        dispatch({ type: "lecturer", data: { ...state.user.lecturer, title } });

    }

    useEffect(() => {
        fetchApi("/faculties").then((res) => {
            if (res[1]) {
                setFaculties(res[0]);

                if (!state.user.lecturer.facultyId) {
                    setFaculty(res[0][0].id);
                }
            }
        });
  
    }, [fetchApi, setFaculty, state.user.lecturer.facultyId])

    if(!state.user.lecturer) return null;

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Tytuł:</Label>
                        <Input
                            type="text"
                            placeholder="Title"
                            value={state.user.lecturer.title ?? ""}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Wydział:</Label>
                        <Input
                            type="select"
                            value={state.user.lecturer.facultyId}
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