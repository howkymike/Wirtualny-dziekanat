import React from 'react';
import {
    FormGroup, Label, Input,
    Row, Col, TabPane
} from 'reactstrap';

const CourseDetailsPanel = props => {

    const { state } = props;

    return(
        <TabPane tabId={ 0 }>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Nazwa:</Label>
                        <Input placeholder="Nazwa" value={ state.name } readOnly />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>Wykłady (h):</Label>
                        <Input placeholder="Wykłady" value={ state.lecture_time } readOnly />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Laboratoria (h):</Label>
                        <Input placeholder="Laboratoria" value={ state.laboratory_time } readOnly />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col>
                    <FormGroup>
                        <Label>ECTS:</Label>
                        <Input placeholder="ECTS" value={ state.ects } readOnly />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label>Egzamin:</Label>
                        <Input placeholder="Egzamin" value={ state.exam ? "TAK" : "NIE" } readOnly />
                    </FormGroup>
                </Col>
            </Row>
        </TabPane>
    );
}

export default CourseDetailsPanel;