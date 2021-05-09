import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    Input, InputGroupText, InputGroupAddon,
    InputGroup, Row, Col, TabPane, Table, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div` 
    padding: 0.5em;
`;

const Box = styled.div` 
    background-color: #f5f5f5;
`;

const CourseLecturersPanel = props => {

    const { state, dispatch, lecturerList } = props;
    const [participants, setParticipants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [signedFilter, setSignedFilter] = useState(true);

    useEffect(() => {
        setParticipants(lecturerList.filter( value => state.courseLecturers.includes(value.id)) );
    }, [lecturerList, state.courseLecturers]);

    useEffect(() => {
        let filtered = lecturerList;

        if(signedFilter)
            filtered = filtered.filter(value => !state.courseLecturers.includes(value.id));

        setFiltered(filtered);
    },[signedFilter, lecturerList, state.courseLecturers]);

    return(
        <TabPane tabId={ 2 }>
            <Wrapper>
                <Row>
                    <Col>
                        <h6>Przypisani</h6>
                        <hr />
                        <Box>
                            <Table hover striped>
                                <thead>
                                <tr><th>Tytuł</th><th>Imię</th><th>Nazwisko</th></tr>
                                </thead>
                                <tbody>
                                { participants.map((value, key) => (
                                    <tr key={key}>
                                        <td>
                                            {value.title}
                                        </td>
                                        <td>
                                            {value.user.name}
                                        </td>
                                        <td>
                                            {value.user.surname}
                                        </td>
                                        <td>
                                            <Button color="danger" onClick={() => dispatch({ type: "deleteLecturer", payload: value.id }) }>
                                                <FontAwesomeIcon icon={ faTimes } />
                                            </Button>
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </Table>
                        </Box>
                        <h6>Lista prowadzących</h6>
                        <hr />
                        <Wrapper>
                            <Row>
                                <Col>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <Input addon type="checkbox" checked={ signedFilter } onChange={ e => setSignedFilter(e.target.checked) } />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input value="Ukryj dodanych" readOnly />
                                    </InputGroup>
                                </Col>
                                <Col>
                                </Col>
                                <Col>
                                </Col>
                            </Row>
                        </Wrapper>
                        <Box>
                            <Table hover striped>
                                <thead>
                                <tr><th>Tytuł</th><th>Imię</th><th>Nazwisko</th></tr>
                                </thead>
                                <tbody>
                                { filtered.map((value, key) => (
                                    <tr key={key}>
                                        <td>
                                            {value.title}
                                        </td>
                                        <td>
                                            {value.user.name}
                                        </td>
                                        <td>
                                            {value.user.surname}
                                        </td>
                                        <td>
                                            { !state.courseLecturers.includes(value.id) ?
                                                <Button color="success" onClick={() => dispatch({ type: "addLecturer", payload: value.id }) }>
                                                    <FontAwesomeIcon icon={ faPlus } />
                                                </Button> :
                                                <Button disabled onClick={() => {} }>
                                                    <FontAwesomeIcon icon={ faPlus } />
                                                </Button>
                                            }
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </Table>
                        </Box>
                    </Col>
                </Row>
            </Wrapper>
        </TabPane>
    );
}

export default CourseLecturersPanel;