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

const CourseDetailsStudentsPanel = props => {

    const { list } = props;

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
                                { list.map((value, key) => (
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