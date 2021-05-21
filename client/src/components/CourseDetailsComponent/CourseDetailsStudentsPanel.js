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

const CourseDetailsStudentsPanel = props => {

    const { state, dispatch, list } = props;
    const [participants, setParticipants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [signedFilter, setSignedFilter] = useState(true);

    useEffect(() => {
        setParticipants(list.filter( value => state.courseStudents.includes(value.id)) );
    }, [list, state.courseStudents]);

    useEffect(() => {
        let filtered = list;

        if(signedFilter) 
            filtered = filtered.filter(value => !state.courseStudents.includes(value.id));

        setFiltered(filtered);
    },[signedFilter, list, state.courseStudents]);

    return(
        <TabPane tabId={ 3 }>
            <Wrapper>
                <Row>
                    <Col>
                        <h6>Zapisani</h6>
                        <hr />
                        <Box>
                            <Table hover striped>
                                <thead>
                                    <tr><th>Index</th><th>Imię</th><th>Nazwisko</th></tr>
                                </thead>
                                <tbody>
                                { participants.map((value, key) => (
                                    <tr key={key}>
                                        <td>
                                            {value.index}
                                        </td>
                                        <td>
                                            {value.user.name}
                                        </td>
                                        <td>
                                            {value.user.surname}
                                        </td>
                                        <td>
                                            <Button color="danger" onClick={() => dispatch({ type: "deleteStudent", payload: value.id }) }>
                                                <FontAwesomeIcon icon={ faTimes } /> 
                                            </Button> 
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </Table>                            
                        </Box>
                        <h6>Lista studentów</h6>
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
                                    <tr><th>Index</th><th>Imię</th><th>Nazwisko</th></tr>
                                </thead>
                                <tbody>
                                { filtered.map((value, key) => (
                                    <tr key={key}>
                                        <td>
                                            {value.index}
                                        </td>
                                        <td>
                                            {value.user.name}
                                        </td>
                                        <td>
                                            {value.user.surname}
                                        </td>
                                        <td>
                                            { !state.courseStudents.includes(value.id) ?
                                                <Button color="success" onClick={() => dispatch({ type: "addStudent", payload: value.id }) }>
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

export default CourseDetailsStudentsPanel;