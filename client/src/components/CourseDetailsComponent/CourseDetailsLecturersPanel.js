import React from 'react';
import styled from 'styled-components';
import {
    Row, Col, TabPane, Table
} from 'reactstrap';

const Wrapper = styled.div` 
    padding: 0.5em;
`;

const Box = styled.div` 
    background-color: #f5f5f5;
`;

const CourseDetailsLecturersPanel = props => {

    const { lecturerList } = props;

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
                                { lecturerList.map((value, key) => (
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

export default CourseDetailsLecturersPanel;