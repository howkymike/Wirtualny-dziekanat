import { useState, useEffect, useContext, useCallback } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { userContext } from '../../context/userContext'

const ClerkTab = props => {

    const { fetchApi } = useContext(userContext);
    const { state, dispatch } = props;

    const [faculties, setFaculties] = useState([]);

    const setFaculty = useCallback((facultyId) => {
        dispatch({ type: "clerk", data: { ...state.user.clerk, facultyId } });
    },[dispatch, state.user.clerk]);

    useEffect(() => {
        fetchApi("/faculties").then((res) => {
            if (res[1]) {
                setFaculties(res[0]);

                if (!state.user.clerk.facultyId) {
                    setFaculty(res[0][0].id);
                }
            }
        });
    }, [fetchApi, setFaculty, state.user.clerk.facultyId]);

    if(!state.user.clerk) return null;

    return (
        <Form>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Wydział:</Label>
                        <Input
                            type="select"
                            value={state.user.clerk.facultyId}
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